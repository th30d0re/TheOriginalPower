#[derive(Debug, Clone, PartialEq)]
pub enum Action {
    Tick,
    Quit,
    UserInput(char),
    Backspace,
    Submit,
    ScrollUp,
    ScrollDown,
    ToggleAuto,
    StopGeneration,
    ClearHistory,
    SetTemp(f32),
    SetMaxTokens(usize),
    SetAutoDelayMs(u64),
    LlamaResponse(String),
    GemmaResponse(String),
    LlamaError(String),
    GemmaError(String),

}
