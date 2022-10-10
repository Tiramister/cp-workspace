#!/bin/bash

# ac-library
git clone https://github.com/atcoder/ac-library

# your library
if [ ! -z "${LIBRARY_REPO_URL}" ]; then
  git clone "${LIBRARY_REPO_URL}"
fi

# login
if [ ! -z "${ATCODER_ID}" ] && [ ! -z "${ATCODER_PASSWORD}" ]; then
  oj login https://atcoder.jp -u "${ATCODER_ID}" -p "${ATCODER_PASSWORD}"
fi
