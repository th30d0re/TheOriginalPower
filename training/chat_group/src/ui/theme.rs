use ratatui::style::{Color, Style};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Voice {
    User,
    Llama,
    Gemma,
    System,
}

impl Voice {
    pub fn label(self) -> &'static str {
        match self {
            Voice::User => "[USER]",
            Voice::Llama => "[LLAMA]",
            Voice::Gemma => "[GEMMA]",
            Voice::System => "[SYS]",
        }
    }

    pub fn style(self) -> Style {
        match self {
            Voice::User => Style::default().fg(Color::Green),
            Voice::Llama => Style::default().fg(Color::Cyan),
            Voice::Gemma => Style::default().fg(Color::Magenta),
            Voice::System => Style::default().fg(Color::Yellow),
        }
    }

    pub fn color(self) -> Color {
        match self {
            Voice::User => Color::Green,
            Voice::Llama => Color::Cyan,
            Voice::Gemma => Color::Magenta,
            Voice::System => Color::Yellow,
        }
    }
}
