#include <algorithm>
#include <concepts>
#include <format>
#include <functional>
#include <iostream>
#include <iterator>
#include <numeric>
#include <print>
#include <queue>
#include <ranges>
#include <sstream>
#include <string>
#include <type_traits>
#include <vector>

using i32 = int;
using i64 = long long int;
using f64 = double;

/*******
 * I/O *
 *******/

template <class T>
  requires requires(std::istream &is, T &x) {
    { is >> x } -> std::convertible_to<std::istream &>;
  }
auto scan() -> T {
  T x;
  std::cin >> x;
  return x;
}

template <class... Args>
auto eprint(std::format_string<Args...> fmt, const Args &...args) -> void {
  std::print(stderr, fmt, args...);
}

template <class... Args>
auto eprintln(std::format_string<Args...> fmt, const Args &...args) -> void {
  std::println(stderr, fmt, args...);
}

/*************
 * container *
 *************/

template <class T>
concept is_not_void = !std::is_void_v<T>;

template <class F>
  requires is_not_void<std::invoke_result_t<F>>
auto vec(i32 n, F f) {
  using T = std::invoke_result_t<F>;

  std::vector<T> v;
  v.reserve(n);
  for (const auto _ : std::views::iota(0, n)) {
    v.push_back(f());
  }
  return v;
}

template <class F>
  requires is_not_void<std::invoke_result_t<F, i32>>
auto vec(i32 n, F f) {
  using T = std::invoke_result_t<F, i32>;

  std::vector<T> v;
  v.reserve(n);
  for (const auto i : std::views::iota(0, n)) {
    v.push_back(f(i));
  }
  return v;
}

template <std::ranges::input_range R, class F>
  requires is_not_void<std::invoke_result_t<F, std::ranges::range_value_t<R>>>
auto map_vec(R &&range, F f) {
  using T = std::invoke_result_t<F, std::ranges::range_value_t<R>>;

  std::vector<T> results;
  std::ranges::transform(std::forward<R>(range),
                         std::back_insert_iterator(results), f);
  return results;
}

template <std::ranges::input_range R>
  requires requires(std::stringstream &ss, R &r) {
    ss << *std::ranges::begin(r);
  }
auto join(R &&range, const std::string &&sep = " ") -> std::string {
  std::stringstream ss;
  bool first = true;
  for (const auto &x : std::forward<R>(range)) {
    if (first) {
      first = false;
    } else {
      ss << sep;
    }
    ss << x;
  }
  return ss.str();
}

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
