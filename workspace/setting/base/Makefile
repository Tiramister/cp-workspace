EXT = cpp

CC = g++
CDEBUG_FLAGS = -std=c++17 -Wall -Wextra -fsanitize=address -fsanitize=undefined -g
CFAST_FLAGS  = -std=c++17 -Wall -Wextra -O2

STGDIR = ../setting
EXPANDER = ../ac-library/expander.py

d:
	$(CC) $(CDEBUG_FLAGS) main.$(EXT)

f:
	$(CC) $(CFAST_FLAGS) main.$(EXT)

ex:
	python3 $(EXPANDER) main.$(EXT)

clean:
	rm -drf ./*
	cp -a $(STGDIR)/base/* .

.PHONY: clean
