# download testcases
if [ $# -ne 0 ]; then
  rm -rf ./test
  oj d "$1"
fi

# debug build
cargo build

# run tests
oj test --command './target/debug/cp-workspace' --tle 10 --error 1e-10 
