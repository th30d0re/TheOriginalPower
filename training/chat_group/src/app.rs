use std::time::{Duration, Instant};

use serde_json::json;

use crate::action::Action;
use crate::agents::{send_request, Agent};
use crate::ui::theme::Voice;

#[derive(Debug, Clone)]
pub struct Message {
    pub voice: Voice,
    pub content: String,
    pub timestamp: Instant,
}

pub struct App {
    pub history: Vec<Message>,
    pub input: String,
    pub scroll: usize,
    pub auto_chat: bool,
    pub llama_generating: bool,
    pub gemma_generating: bool,
    pub temp: f32,
    pub max_tokens: usize,
    pub auto_delay_ms: u64,
    pub pending_auto: Option<(Voice, String, Instant)>,
    pub status_message: Option<String>,
    pub should_quit: bool,
    pub llama_agent: Option<Agent>,
    pub gemma_agent: Option<Agent>,
}

impl App {
    pub fn new() -> Self {
        Self {
            history: Vec::new(),
            input: String::new(),
            scroll: 0,
            auto_chat: false,
            llama_generating: false,
            gemma_generating: false,
            temp: 0.7,
            max_tokens: 512,
            auto_delay_ms: 2000,
            pending_auto: None,
            status_message: None,
            should_quit: false,
            llama_agent: None,
            gemma_agent: None,
        }
    }

    pub fn update(&mut self, action: Action) {
        match action {
            Action::Tick => self.handle_tick(),
            Action::Quit => self.should_quit = true,
            Action::UserInput(c) => self.input.push(c),
            Action::Backspace => {
                self.input.pop();
            }
            Action::Submit => self.handle_submit(),
            Action::ScrollUp => self.scroll = self.scroll.saturating_add(1),
            Action::ScrollDown => self.scroll = self.scroll.saturating_sub(1),
            Action::ToggleAuto => {
                self.auto_chat = !self.auto_chat;
                self.status_message = Some(format!(
                    "Auto-chat: {}",
                    if self.auto_chat { "ON" } else { "OFF" }
                ));
            }
            Action::StopGeneration => {
                self.llama_generating = false;
                self.gemma_generating = false;
                self.pending_auto = None;
                self.status_message = Some("Generation stopped.".to_string());
            }
            Action::ClearHistory => {
                self.history.clear();
                self.scroll = 0;
                self.status_message = Some("History cleared.".to_string());
            }
            Action::SetTemp(t) => {
                self.temp = t.clamp(0.0, 2.0);
                self.status_message = Some(format!("Temperature: {:.2}", self.temp));
            }
            Action::SetMaxTokens(n) => {
                self.max_tokens = n.max(1).min(4096);
                self.status_message = Some(format!("Max tokens: {}", self.max_tokens));
            }
            Action::SetAutoDelayMs(n) => {
                self.auto_delay_ms = n.max(100).min(30000);
                self.status_message = Some(format!("Auto delay: {}ms", self.auto_delay_ms));
            }
            Action::LlamaResponse(text) => {
                self.llama_generating = false;
                self.history.push(Message {
                    voice: Voice::Llama,
                    content: text.clone(),
                    timestamp: Instant::now(),
                });
                self.scroll = 0;
                if self.auto_chat {
                    self.pending_auto = Some((
                        Voice::Gemma,
                        text,
                        Instant::now() + Duration::from_millis(self.auto_delay_ms),
                    ));
                }
            }
            Action::GemmaResponse(text) => {
                self.gemma_generating = false;
                self.history.push(Message {
                    voice: Voice::Gemma,
                    content: text.clone(),
                    timestamp: Instant::now(),
                });
                self.scroll = 0;
                if self.auto_chat {
                    self.pending_auto = Some((
                        Voice::Llama,
                        text,
                        Instant::now() + Duration::from_millis(self.auto_delay_ms),
                    ));
                }
            }
            Action::LlamaError(err) => {
                self.llama_generating = false;
                self.history.push(Message {
                    voice: Voice::System,
                    content: format!("Llama error: {err}"),
                    timestamp: Instant::now(),
                });
                self.scroll = 0;
            }
            Action::GemmaError(err) => {
                self.gemma_generating = false;
                self.history.push(Message {
                    voice: Voice::System,
                    content: format!("Gemma error: {err}"),
                    timestamp: Instant::now(),
                });
                self.scroll = 0;
            }
        }
    }

    fn handle_submit(&mut self) {
        let text = self.input.trim().to_string();
        self.input.clear();
        if text.is_empty() {
            return;
        }

        if text.starts_with('/') {
            self.handle_command(&text);
            return;
        }

        self.history.push(Message {
            voice: Voice::User,
            content: text.clone(),
            timestamp: Instant::now(),
        });
        self.scroll = 0;
        self.send_to_both();
    }

    fn handle_command(&mut self, text: &str) {
        let parts: Vec<&str> = text.splitn(2, ' ').collect();
        match parts[0] {
            "/quit" | "/q" => self.should_quit = true,
            "/auto" => self.update(Action::ToggleAuto),
            "/clear" => self.update(Action::ClearHistory),
            "/stop" => self.update(Action::StopGeneration),
            "/llama" => {
                if let Some(msg) = parts.get(1) {
                    let content = msg.trim().to_string();
                    self.history.push(Message {
                        voice: Voice::User,
                        content: content.clone(),
                        timestamp: Instant::now(),
                    });
                    self.scroll = 0;
                    self.send_to(Voice::Llama);
                } else {
                    self.status_message = Some("Usage: /llama <message>".to_string());
                }
            }
            "/gemma" => {
                if let Some(msg) = parts.get(1) {
                    let content = msg.trim().to_string();
                    self.history.push(Message {
                        voice: Voice::User,
                        content: content.clone(),
                        timestamp: Instant::now(),
                    });
                    self.scroll = 0;
                    self.send_to(Voice::Gemma);
                } else {
                    self.status_message = Some("Usage: /gemma <message>".to_string());
                }
            }
            "/temp" => {
                if let Some(arg) = parts.get(1) {
                    if let Ok(t) = arg.trim().parse::<f32>() {
                        self.update(Action::SetTemp(t));
                    } else {
                        self.status_message = Some("Usage: /temp 0.7".to_string());
                    }
                }
            }
            "/tokens" => {
                if let Some(arg) = parts.get(1) {
                    if let Ok(n) = arg.trim().parse::<usize>() {
                        self.update(Action::SetMaxTokens(n));
                    } else {
                        self.status_message = Some("Usage: /tokens 512".to_string());
                    }
                }
            }
            "/delay" => {
                if let Some(arg) = parts.get(1) {
                    if let Ok(n) = arg.trim().parse::<u64>() {
                        self.update(Action::SetAutoDelayMs(n));
                    } else {
                        self.status_message = Some("Usage: /delay 2000".to_string());
                    }
                }
            }
            _ => self.status_message = Some(format!("Unknown command: {}", parts[0])),
        }
    }

    fn handle_tick(&mut self) {
        if let Some((target, content, when)) = self.pending_auto.take() {
            if Instant::now() >= when {
                self.history.push(Message {
                    voice: Voice::User,
                    content: format!("[auto-forward from {target:?}] {content}"),
                    timestamp: Instant::now(),
                });
                self.scroll = 0;
                self.send_to(target);
            } else {
                self.pending_auto = Some((target, content, when));
            }
        }
    }

    fn send_to_both(&mut self) {
        let history = self.format_history();
        if let Some(agent) = self.llama_agent.as_mut() {
            self.llama_generating = true;
            let _ = send_request(agent, &history, self.max_tokens, self.temp);
        }
        if let Some(agent) = self.gemma_agent.as_mut() {
            self.gemma_generating = true;
            let _ = send_request(agent, &history, self.max_tokens, self.temp);
        }
    }

    fn send_to(&mut self, target: Voice) {
        let history = self.format_history();
        match target {
            Voice::Llama => {
                if let Some(agent) = self.llama_agent.as_mut() {
                    self.llama_generating = true;
                    let _ = send_request(agent, &history, self.max_tokens, self.temp);
                }
            }
            Voice::Gemma => {
                if let Some(agent) = self.gemma_agent.as_mut() {
                    self.gemma_generating = true;
                    let _ = send_request(agent, &history, self.max_tokens, self.temp);
                }
            }
            _ => {}
        }
    }

    fn format_history(&self) -> Vec<serde_json::Value> {
        self.history
            .iter()
            .map(|msg| {
                let role = match msg.voice {
                    Voice::User | Voice::System => "user",
                    Voice::Llama | Voice::Gemma => "assistant",
                };
                json!({"role": role, "content": msg.content})
            })
            .collect()
    }
}
