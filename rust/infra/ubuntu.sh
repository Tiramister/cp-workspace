#!/bin/zsh

### Rust ###
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# AtCoder の実行環境が 1.42.0
# cargo-udeps に nightly が必要
rustup toolchain install 1.42.0 nightly

# cargo-compete
# prettytable-rs が 0.9.0 以下のとき、セグフォが発生する
git clone https://github.com/qryxip/cargo-compete.git &&\
  sed -i -E 's/(prettytable-rs = )"[0-9.]+"/\1"0.10.0"/g' cargo-compete/Cargo.toml
cargo install --path cargo-compete &&\
rm -rf cargo-compete

# cargo-equip
git clone https://github.com/qryxip/cargo-equip.git &&\
  sed -i -E 's/(prettytable-rs = )"[0-9.]+"/\1"0.10.0"/g' cargo-equip/Cargo.toml
cargo install --path cargo-equip &&\
rm -rf cargo-equip

# cargo-udeps
cargo install cargo-udeps
