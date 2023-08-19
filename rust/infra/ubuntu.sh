#!/bin/zsh

### Rust ###
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $XDG_DATA_HOME/cargo/env

# AtCoder の実行環境が 1.70.0
# cargo-udeps に nightly が必要
rustup toolchain install 1.70.0 nightly

cargo install cargo-compete cargo-equip cargo-udeps

