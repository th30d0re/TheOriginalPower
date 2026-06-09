use ratatui::{
    layout::Rect,
    style::{Color, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::app::App;

pub fn render_prompt(frame: &mut Frame, area: Rect, app: &App) {
    let block = Block::default()
        .borders(Borders::TOP)
        .border_style(Style::default().fg(Color::DarkGray));

    let inner = block.inner(area);
    frame.render_widget(block, area);

    let input_line = Line::from(vec![
        Span::styled("> ", Style::default().fg(Color::Green).add_modifier(ratatui::style::Modifier::BOLD)),
        Span::raw(&app.input),
        Span::styled("█", Style::default().fg(Color::Green)),
    ]);

    let help_line = Line::from(vec![
        Span::styled(
            "/quit /auto /llama /gemma /temp /tokens /delay /clear /stop",
            Style::default().fg(Color::DarkGray),
        ),
    ]);

    let text = Text::from(vec![input_line, help_line]);
    let paragraph = Paragraph::new(text);
    frame.render_widget(paragraph, inner);
}
