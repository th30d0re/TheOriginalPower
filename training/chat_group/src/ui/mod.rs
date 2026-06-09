use ratatui::Frame;

use crate::app::App;

pub mod layout;
pub mod panes;
pub mod prompt;
pub mod status;
pub mod theme;

pub fn render(frame: &mut Frame, app: &App) {
    let area = frame.area();
    let (chat_area, status_area, prompt_area) = layout::main_layout(area);

    panes::render_chat(frame, chat_area, app);
    status::render_status(frame, status_area, app);
    prompt::render_prompt(frame, prompt_area, app);
}
