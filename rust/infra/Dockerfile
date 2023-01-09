FROM archlinux:base-devel

### Arch packages
# Nodejs and npm are required by coc.nvim
RUN pacman --noconfirm -Syy vim git zsh zsh-completions nodejs npm

### Add user
ARG uid=501
ARG user=tiramister
RUN useradd -m -g wheel -u $uid -s /bin/zsh $user && passwd -d $user
USER $user
ENV HOME /home/$user
WORKDIR $HOME

### Rustup
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH $HOME/.cargo/bin:$PATH
RUN rustup toolchain install 1.42.0-x86_64-unknown-linux-gnu
RUN rustup component add rust-analyzer

### Competitive programming tools
RUN cargo install cargo-compete cargo-equip cargo-udeps

### Dotfiles
# Avoid caching. See: https://stackoverflow.com/a/39278224
ADD https://api.github.com/repos/Tiramister/dotfiles/git/refs/heads/main version.json
RUN git clone https://github.com/Tiramister/dotfiles.git \
  && cd dotfiles && ./init.sh
RUN rm version.json

### Keep running
ENTRYPOINT ["tail", "-f", "/dev/null"]

