use ratatui::{
    layout::{Alignment, Rect},
    style::{Color, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::app::App;


pub fn render_chat(frame: &mut Frame, area: Rect, app: &App) {
    let block = Block::default()
        .borders(Borders::ALL)
        .title(" Root Ledger Group Chat ")
        .title_alignment(Alignment::Center)
        .border_style(Style::default().fg(Color::DarkGray));

    let inner = block.inner(area);
    frame.render_widget(block, area);

    if app.history.is_empty() {
        let empty = Paragraph::new("No messages yet.").style(Style::default().fg(Color::DarkGray));
        frame.render_widget(empty, inner);
        return;
    }

    // Build flat list of Lines from history with word wrapping
    let width = inner.width.saturating_sub(2) as usize;
    let mut lines: Vec<Line> = Vec::new();

    for msg in &app.history {
        let prefix = msg.voice.label();
        let style = msg.voice.style();
        let prefix_line = Line::from(vec![
            Span::styled(prefix, style.add_modifier(ratatui::style::Modifier::BOLD)),
            Span::raw(" "),
        ]);
        lines.push(prefix_line);

        for content_line in wrap_text(&msg.content, width.saturating_sub(2)) {
            lines.push(Line::from(vec![
                Span::raw("  "),
                Span::styled(content_line, style),
            ]));
        }
        lines.push(Line::from(""));
    }

    // Scroll: app.scroll is number of lines from bottom to show
    let visible_height = inner.height as usize;
    let total_lines = lines.len();
    let start = if total_lines > visible_height + app.scroll {
        total_lines - visible_height - app.scroll
    } else {
        0
    };
    let end = (start + visible_height).min(total_lines);
    let visible: Vec<Line> = lines[start..end].to_vec();

    let text = Text::from(visible);
    let paragraph = Paragraph::new(text);
    frame.render_widget(paragraph, inner);
}

fn wrap_text(text: &str, width: usize) -> Vec<String> {
    let mut lines = Vec::new();
    if width == 0 {
        lines.push(text.to_string());
        return lines;
    }

    for paragraph in text.split('\n') {
        let mut current = String::new();
        for word in paragraph.split_whitespace() {
            let word_len = word.len();
            if word_len > width {
                if !current.is_empty() {
                    lines.push(current);
                    current = String::new();
                }
                // Truncate overly long words
                let mut start = 0;
                while start < word_len {
                    let end = (start + width).min(word_len);
                    lines.push(word[start..end].to_string());
                    start = end;
                }
                continue;
            }

            if current.len() + word_len + 1 > width {
                if !current.is_empty() {
                    lines.push(current);
                }
                current = word.to_string();
            } else {
                if !current.is_empty() {
                    current.push(' ');
                }
                current.push_str(word);
            }
        }
        if !current.is_empty() {
            lines.push(current);
        }
    }

    if lines.is_empty() {
        lines.push(String::new());
    }

    lines
}


