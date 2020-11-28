EXT = cpp
CODE = main.$(EXT)

CC = g++
CFLAGS = -std=c++17 -Wall -Wextra -fsanitize=address -fsanitize=undefined -g

STGDIR = ../setting
EXPANDER = ~/CompetitiveProgramming/ac-library/expander.py


default:
	$(CC) $(CFLAGS) $(CODE)

cp:
	cat $(CODE) | pbcopy

ex:
	python3 $(EXPANDER) $(CODE)

clean:
	rm -drf ./*
	cp -a $(STGDIR)/base/* .

s:
	python3 $(STGDIR)/submit.py

.PHONY: clean
