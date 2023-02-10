sudo apt update && sudo apt upgrade

### 基本 ###
# 後半は cargo パッケージのビルドに必要
sudo apt install \
  vim git zsh \
  libssl-dev pkg-config build-essential

# ログインシェルの変更
sudo chsh $USER -s $(which zsh)

# nodejs, npm
# https://github.com/nodesource/distributions/blob/master/README.md#debinstall
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
sudo apt install -y nodejs

### Rust ###
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# AtCoder の実行環境が 1.42.0
# cargo-udeps に nightly が必要
rustup toolchain install 1.42.0 nightly
rustup component add rust-analyzer

# cargo-compete
# prettytable-rs が 0.9.0 以下のとき、セグフォが発生する
git clone https://github.com/qryxip/cargo-compete.git &&\
  sed -i -E 's/(prettytable-rs = )"[0-9.]+"/\1"0.10.0"/g' cargo-compete/Cargo.toml &&\
  cargo install --path cargo-compete &&\
  rm -rf cargo-compete

# cargo-equip
git clone https://github.com/qryxip/cargo-equip.git &&\
  sed -i -E 's/(prettytable-rs = )"[0-9.]+"/\1"0.10.0"/g' cargo-equip/Cargo.toml &&\
  cargo install --path cargo-equip &&\
  rm -rf cargo-equip

# cargo-udeps
cargo install cargo-udeps

### dotfiles
git clone https://github.com/Tiramister/dotfiles.git
cd dotfiles
./init.sh

# rust-analyzer の場所を直す
sed -i -E \
  's/("rust-analyzer\.server\.path").*$/\1: ".rustup\/toolchains\/stable-aarch64-unknown-linux-gnu\/bin\/rust-analyzer"/' \
  $HOME/.vim/coc-settings.json
