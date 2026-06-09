mod action;
mod agents;
mod app;
mod event;
mod tui;
mod ui;

use std::sync::mpsc;
use std::time::Duration;

use clap::Parser;
use color_eyre::eyre::Result;

use crate::action::Action;
use crate::agents::spawn_agent;
use crate::app::{App, Message};
use crate::event::spawn_input_thread;
use crate::tui::{install_panic_hook, TerminalGuard};
use crate::ui::render;
use crate::ui::theme::Voice;

#[derive(Debug, Clone, Parser)]
#[command(name = "chat_group")]
#[command(about = "Root Ledger Group Chat — Talk to Llama and Gemma simultaneously")]
pub struct CliArgs {
    #[arg(long, default_value = "../../.venv-voice/bin/python3")]
    pub python_path: String,

    #[arg(long, default_value = "../inference_agent.py")]
    pub agent_script: String,

    #[arg(
        long,
        default_value = "../fused_models/RootLedger-8B-Abliterated-Fused"
    )]
    pub llama_path: String,

    #[arg(
        long,
        default_value = "../fused_models/RootLedger-Gemma3-12B-NPBP-Abliterated-v3-Fused"
    )]
    pub gemma_path: String,

    #[arg(long, default_value = "0.7")]
    pub temp: f32,

    #[arg(long, default_value = "512")]
    pub max_tokens: usize,
}

pub struct Config {
    pub python_path: String,
    pub agent_script: String,
    pub llama_path: String,
    pub gemma_path: String,
    pub temp: f32,
    pub max_tokens: usize,
}

impl Config {
    pub fn build(args: CliArgs) -> Result<Self> {
        Ok(Self {
            python_path: args.python_path,
            agent_script: args.agent_script,
            llama_path: args.llama_path,
            gemma_path: args.gemma_path,
            temp: args.temp,
            max_tokens: args.max_tokens,
        })
    }
}

pub fn run(config: Config) -> Result<()> {
    install_panic_hook();
    let mut terminal = TerminalGuard::new()?;

    let (action_tx, action_rx) = mpsc::channel();

    // Spawn input thread
    spawn_input_thread(action_tx.clone());

    // Spawn agents
    let llama_agent = spawn_agent(
        &config.python_path,
        &config.agent_script,
        &config.llama_path,
        action_tx.clone(),
        Voice::Llama,
    )?;

    let gemma_agent = spawn_agent(
        &config.python_path,
        &config.agent_script,
        &config.gemma_path,
        action_tx.clone(),
        Voice::Gemma,
    )?;

    let mut app = App::new();
    app.llama_agent = Some(llama_agent);
    app.gemma_agent = Some(gemma_agent);
    app.temp = config.temp;
    app.max_tokens = config.max_tokens;

    app.history.push(Message {
        voice: Voice::System,
        content: "Root Ledger Group Chat initialized. Type /quit to exit.".to_string(),
        timestamp: std::time::Instant::now(),
    });

    loop {
        terminal.terminal().draw(|frame| render(frame, &app))?;

        let action = match action_rx.recv_timeout(Duration::from_millis(50)) {
            Ok(a) => a,
            Err(mpsc::RecvTimeoutError::Timeout) => Action::Tick,
            Err(mpsc::RecvTimeoutError::Disconnected) => Action::Quit,
        };

        app.update(action);

        if app.should_quit {
            break;
        }
    }

    // Clean up agents
    if let Some(mut agent) = app.llama_agent.take() {
        let _ = agent.child.kill();
    }
    if let Some(mut agent) = app.gemma_agent.take() {
        let _ = agent.child.kill();
    }

    Ok(())
}
