FROM mcr.microsoft.com/devcontainers/rust:1-bullseye
USER vscode
RUN cargo install cargo-compete cargo-equip cargo-udeps \
 && rustup toolchain install 1.42.0-x86_64-unknown-linux-gnu nightly-x86_64-unknown-linux-gnu
