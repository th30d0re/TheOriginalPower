use std::sync::mpsc::Sender;
use std::time::Duration;

use crossterm::event::{self, Event as CrosstermEvent, KeyCode, KeyEventKind, KeyModifiers};

use crate::action::Action;

pub fn spawn_input_thread(tx: Sender<Action>) {
    std::thread::spawn(move || {
        loop {
            if let Ok(true) = event::poll(Duration::from_millis(50)) {
                if let Ok(evt) = event::read() {
                    if let Some(action) = convert_event(evt) {
                        if tx.send(action).is_err() {
                            break;
                        }
                    }
                }
            }
        }
    });
}

fn convert_event(event: CrosstermEvent) -> Option<Action> {
    match event {
        CrosstermEvent::Key(key) if key.kind == KeyEventKind::Press => match key.code {
            KeyCode::Char('c') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                Some(Action::Quit)
            }
            KeyCode::Char(c) => Some(Action::UserInput(c)),
            KeyCode::Backspace => Some(Action::Backspace),
            KeyCode::Enter => Some(Action::Submit),
            KeyCode::Up => Some(Action::ScrollUp),
            KeyCode::Down => Some(Action::ScrollDown),
            KeyCode::Esc => Some(Action::StopGeneration),
            _ => None,
        },
        _ => None,
    }
}
