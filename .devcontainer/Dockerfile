FROM ubuntu:latest

# install command line tools
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y --no-install-recommends \
    build-essential git ca-certificates sudo \
    python python3-pip cppcheck

# add user
ARG LOCAL_UID
ENV LOCAL_UID=${LOCAL_UID:-1000} \
    LOCAL_USER="vscode" \
    LOCAL_PASSWORD="vscode"
RUN useradd -m --uid ${LOCAL_UID} --groups sudo -s $(which bash) ${LOCAL_USER} && \
    echo "${LOCAL_USER}:${LOCAL_PASSWORD}" | chpasswd
USER ${LOCAL_USER}

ENV HOME_DIR=/home/${LOCAL_USER}
WORKDIR ${HOME_DIR}/workspace

# online judge tools
RUN pip install --upgrade pip && \
    pip install online-judge-tools
