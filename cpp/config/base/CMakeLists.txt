cmake_minimum_required(VERSION 4.2)
project(main CXX)

add_executable(a.out main.cpp)
target_compile_features(a.out PRIVATE cxx_std_23)
target_compile_options(a.out PRIVATE
        -Wall -Wextra -Wpedantic
        $<$<CONFIG:Debug>:-fsanitize=address,undefined>
        $<$<CONFIG:Release>:-O2>
)
target_link_options(a.out PRIVATE
        $<$<CONFIG:Debug>:-fsanitize=address,undefined>
)
target_include_directories(a.out PRIVATE ../config/ac-library ../config/libs)
