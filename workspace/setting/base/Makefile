EXT=cpp
CC=g++
CCOMMON_FLAGS=-std=c++17 -Wall -Wextra
CDEBUG_FLAGS=-fsanitize=address -fsanitize=undefined -g
CFAST_FLAGS=-O2

STGDIR=../setting
EXPANDER=../ac-library/expander.py

d:
	${CC} ${CCOMMON_FLAGS} ${CDEBUG_FLAGS} main.${EXT}

f:
	${CC} ${CCOMMON_FLAGS} ${CFAST_FLAGS} main.${EXT}

ex:
	python3 ${EXPANDER} main.${EXT}

clean:
	rm -drf ./*
	cp -a ${STGDIR}/base/* .

.PHONY: clean
