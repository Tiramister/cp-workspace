FROM mcr.microsoft.com/devcontainers/rust:1-bullseye
USER vscode
RUN cargo install cargo-make cargo-compete \
 && rustup toolchain install 1.42.0-x86_64-unknown-linux-gnu 
