use std::io::{BufRead, BufReader, Write};
use std::process::{Child, Command, Stdio};
use std::sync::mpsc::Sender;
use std::thread;

use color_eyre::eyre::{eyre, Result};
use serde_json::json;

use crate::action::Action;
use crate::ui::theme::Voice;

pub struct Agent {
    pub child: Child,
    pub stdin: std::process::ChildStdin,
}

pub fn spawn_agent(
    python_path: &str,
    agent_script: &str,
    model_path: &str,
    action_tx: Sender<Action>,
    voice: Voice,
) -> Result<Agent> {
    let mut child = Command::new(python_path)
        .arg(agent_script)
        .arg("--model-path")
        .arg(model_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| eyre!("Failed to spawn {voice:?} agent: {e}"))?;

    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| eyre!("Failed to capture {voice:?} stdout"))?;

    let stdin = child
        .stdin
        .take()
        .ok_or_else(|| eyre!("Failed to capture {voice:?} stdin"))?;

    // Spawn reader thread
    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            match line {
                Ok(text) => {
                    if let Ok(val) = serde_json::from_str::<serde_json::Value>(&text) {
                        if let Some(resp) = val.get("response").and_then(|v| v.as_str()) {
                            let action = match voice {
                                Voice::Llama => Action::LlamaResponse(resp.to_string()),
                                Voice::Gemma => Action::GemmaResponse(resp.to_string()),
                                _ => continue,
                            };
                            let _ = action_tx.send(action);
                        } else if let Some(err) = val.get("error").and_then(|v| v.as_str()) {
                            let action = match voice {
                                Voice::Llama => Action::LlamaError(err.to_string()),
                                Voice::Gemma => Action::GemmaError(err.to_string()),
                                _ => continue,
                            };
                            let _ = action_tx.send(action);
                        }
                    }
                }
                Err(_) => break,
            }
        }
    });

    Ok(Agent { child, stdin })
}

pub fn send_request(agent: &mut Agent, history: &[serde_json::Value], max_tokens: usize, temp: f32) -> Result<()> {
    let req = json!({
        "history": history,
        "max_tokens": max_tokens,
        "temp": temp,
    });
    let line = format!("{}\n", req.to_string());
    agent.stdin.write_all(line.as_bytes())?;
    agent.stdin.flush()?;
    Ok(())
}
