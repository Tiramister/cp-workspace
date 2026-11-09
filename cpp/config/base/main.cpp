#include "utils.cpp"

using namespace std;

void solve() {
  // write here
}

int main() {
  cin.tie(nullptr);
  ios::sync_with_stdio(false);

  // #define MULTI_CASE

#ifdef MULTI_CASE
  RLL(t);
  IREP(i, t) { solve(); }
#else
  solve();
#endif

  return 0;
}
