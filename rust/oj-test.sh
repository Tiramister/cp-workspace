#!/bin/sh

cargo clean -p cp-workspace
cargo build
oj test --command './target/debug/cp-workspace' --tle 10 --error 1e-10 
