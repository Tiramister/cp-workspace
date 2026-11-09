#include <algorithm>
#include <format>
#include <functional>
#include <iostream>
#include <iterator>
#include <map>
#include <numeric>
#include <queue>
#include <ranges>
#include <string>
#include <vector>

/****************
 * Type Aliases *
 ****************/

using LL = long long int;
using S = std::string;

template <class T>
using V = std::vector<T>;
using VLL = V<LL>;
using VVLL = V<V<LL>>;
using VS = V<S>;

template <class T, class U>
using P = std::pair<T, U>;
using PLL = P<LL, LL>;

/*********
 * Input *
 *********/
template <class... Ts>
void read_multiple(Ts &...args) {
  ((std::cin >> args), ...);
}

template <class T>
V<T> read_vector(int n) {
  auto v = V<T>(n);
  for (auto &x : v) {
    std::cin >> x;
  }
  return v;
}

template <class T>
V<V<T>> read_vector_vector(int n, int m) {
  auto vv = V(n, V<T>(m));
  for (auto &v : vv) {
    for (auto &x : v) {
      std::cin >> x;
    }
  }
  return vv;
}

#define RLL(...)                                                               \
  LL __VA_ARGS__;                                                              \
  read_multiple(__VA_ARGS__);
#define RS(...)                                                                \
  S __VA_ARGS__;                                                               \
  read_multiple(__VA_ARGS__)
#define RVLL(v, n) VLL v = read_vector<LL>(n);
#define RVVLL(vv, n, m) VVLL vv = read_vector_vector<LL>(n, m);
#define RVS(ss, n) VS ss = read_vector<S>(n);

/**********
 * Output *
 **********/

template <class... Ts>
void PR(Ts... values) {
  ((std::cout << values << ' '), ...);
  std::cout << '\n';
}

template <class T>
void PRV(V<T> v) {
  for (const auto &x : v) {
    std::cout << x << ' ';
  }
  std::cout << '\n';
}

template <class T>
void PRVV(V<V<T>> vv) {
  for (const auto &v : vv) {
    for (const auto &x : v) {
      std::cout << x << ' ';
    }
    std::cout << '\n';
  }
}

template <class... Ts>
void EPR(Ts... values) {
  ((std::cerr << values << ' '), ...);
  std::cerr << '\n';
}

template <class T>
void EPRV(V<T> v) {
  for (const auto &x : v) {
    std::cerr << x << ' ';
  }
  std::cerr << '\n';
}

template <class T>
void EPRVV(V<V<T>> vv) {
  for (const auto &v : vv) {
    for (const auto &x : v) {
      std::cerr << x << ' ';
    }
    std::cerr << '\n';
  }
}

/**********
 * Repeat *
 **********/

#define REP(x, v) for (auto &x : v)
#define IREP(i, n) for (LL i = 0; i < (LL)(n); i++)
#define IREPR(i, l, r) for (LL i = (LL)(l); i < (LL)(r); i++)
#define IRREP(i, n) for (LL i = (LL)(n) - 1; i >= 0; i--)
#define IRREPR(i, l, r) for (LL i = (LL)(r) - 1; i >= (LL)(l); i--)

/********
 * misc *
 ********/

auto yes_no(const bool &cond, const std::string &yes = "Yes",
            const std::string &no = "No") -> std::string {
  return cond ? yes : no;
}

template <class T>
using MaxHeap = std::priority_queue<T>;
template <class T>
using MinHeap = std::priority_queue<T, std::vector<T>, std::greater<T>>;
