use ratatui::{
    layout::{Alignment, Rect},
    style::{Color, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

use crate::app::App;
use crate::ui::theme::Voice;

pub fn render_status(frame: &mut Frame, area: Rect, app: &App) {
    let block = Block::default()
        .borders(Borders::ALL)
        .title(" Status ")
        .title_alignment(Alignment::Left)
        .border_style(Style::default().fg(Color::DarkGray));

    let inner = block.inner(area);
    frame.render_widget(block, area);

    let llama_status = if app.llama_generating {
        Span::styled("generating…", Style::default().fg(Color::Yellow))
    } else {
        Span::styled("idle", Style::default().fg(Color::Green))
    };

    let gemma_status = if app.gemma_generating {
        Span::styled("generating…", Style::default().fg(Color::Yellow))
    } else {
        Span::styled("idle", Style::default().fg(Color::Green))
    };

    let auto_status = if app.auto_chat {
        Span::styled("ON", Style::default().fg(Color::Green))
    } else {
        Span::styled("OFF", Style::default().fg(Color::DarkGray))
    };

    let pending = if let Some((target, _, when)) = &app.pending_auto {
        let remaining = when.saturating_duration_since(std::time::Instant::now()).as_secs();
        Span::styled(
            format!("{:?} in {}s", target, remaining),
            Style::default().fg(Color::Yellow),
        )
    } else {
        Span::styled("none", Style::default().fg(Color::DarkGray))
    };

    let mut lines = vec![
        Line::from(vec![
            Span::styled(
                "Llama",
                Voice::Llama
                    .style()
                    .add_modifier(ratatui::style::Modifier::BOLD),
            ),
            Span::raw(": "),
            llama_status,
        ]),
        Line::from(vec![
            Span::styled(
                "Gemma",
                Voice::Gemma
                    .style()
                    .add_modifier(ratatui::style::Modifier::BOLD),
            ),
            Span::raw(": "),
            gemma_status,
        ]),
        Line::from(""),
        Line::from(vec![
            Span::styled("Temp: ", Style::default().fg(Color::White)),
            Span::raw(format!("{:.2}", app.temp)),
        ]),
        Line::from(vec![
            Span::styled("Tokens: ", Style::default().fg(Color::White)),
            Span::raw(format!("{}", app.max_tokens)),
        ]),
        Line::from(vec![
            Span::styled("Delay: ", Style::default().fg(Color::White)),
            Span::raw(format!("{}ms", app.auto_delay_ms)),
        ]),
        Line::from(vec![
            Span::styled("Auto: ", Style::default().fg(Color::White)),
            auto_status,
        ]),
        Line::from(vec![
            Span::styled("Pending: ", Style::default().fg(Color::White)),
            pending,
        ]),
    ];

    if let Some(msg) = &app.status_message {
        lines.push(Line::from(""));
        lines.push(Line::from(Span::styled(
            msg.clone(),
            Style::default().fg(Color::Yellow),
        )));
    }

    let text = Text::from(lines);
    let paragraph = Paragraph::new(text).wrap(Wrap { trim: true });
    frame.render_widget(paragraph, inner);
}
