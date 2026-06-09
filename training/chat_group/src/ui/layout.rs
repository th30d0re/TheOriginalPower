use ratatui::layout::{Constraint, Direction, Layout, Rect};

pub fn main_layout(area: Rect) -> (Rect, Rect, Rect) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(0), Constraint::Length(3)])
        .split(area);

    let top = chunks[0];
    let bottom = chunks[1];

    let hchunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(70), Constraint::Percentage(30)])
        .split(top);

    (hchunks[0], hchunks[1], bottom)
}
