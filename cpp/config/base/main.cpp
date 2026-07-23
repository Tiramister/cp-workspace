#include "utils.cpp"

using namespace std;

void solve() {
  // write here
}

auto main() -> int {
  cin.tie(nullptr);
  ios::sync_with_stdio(false);

  // #define MULTI_CASE

#ifdef MULTI_CASE
  for (const auto _ : views::iota(0, scan<i32>())) {
    solve();
  }
#else
  solve();
#endif

  return 0;
}
