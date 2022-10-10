FROM ubuntu:latest

# install command line tools
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y --no-install-recommends \
    build-essential git ca-certificates sudo \
    python python3-pip cppcheck

# add user
ARG LOCAL_UID
ARG LOCAL_USER
ARG LOCAL_PASSWORD
RUN useradd -m --uid ${LOCAL_UID} --groups sudo -s $(which bash) ${LOCAL_USER} && \
    echo "${LOCAL_USER}:${LOCAL_PASSWORD}" | chpasswd
USER ${LOCAL_UID}

WORKDIR /workspace

# download AtCoder Library
RUN git clone https://github.com/atcoder/ac-library.git
# online judge tools
RUN pip install --upgrade pip && \
    pip install online-judge-tools
