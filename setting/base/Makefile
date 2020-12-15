EXT = cpp

CC = g++
CFLAGS = -std=c++17 -Wall -Wextra -fsanitize=address -fsanitize=undefined -g

STGDIR = ../setting
EXPANDER = ~/CompetitiveProgramming/ac-library/expander.py


default:
	$(CC) $(CFLAGS) main.$(EXT)

ex:
	python3 $(EXPANDER) main.$(EXT)

b:
	python3 $(STGDIR)/bundle.py

cp:
	make b
	pbcopy < bundled.$(EXT)

s:
	make b
	python3 $(STGDIR)/submit.py

clean:
	rm -drf ./*
	cp -a $(STGDIR)/base/* .

.PHONY: clean
