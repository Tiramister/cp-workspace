# if you want to specify the number of directory, type "make gen D={#dirs}"
# default: 6
gen:
	python3 setting/gen.py $(D)

clean:
	python3 setting/clean.py

.PHONY: clean
