use std::process::ExitCode;

use chat_group::{run, CliArgs};
use clap::Parser;


fn main() -> ExitCode {
    if let Err(e) = color_eyre::install() {
        eprintln!("Failed to install color-eyre: {e}");
        return ExitCode::FAILURE;
    }

    let args = CliArgs::parse();
    let config = match chat_group::Config::build(args) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("{:#}", e);
            return ExitCode::FAILURE;
        }
    };

    match run(config) {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("{:#}", e);
            ExitCode::FAILURE
        }
    }
}
