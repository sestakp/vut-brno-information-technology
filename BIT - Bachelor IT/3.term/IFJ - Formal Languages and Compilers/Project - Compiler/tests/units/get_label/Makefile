CC=gcc -std=c99 -g
NAME=label_test

build:
	@echo "[info] starting CC build for test label_get"
	$(CC) *.c -o $(NAME) -D DEBUG=3

test: build
	@echo "[info] performing test label_get"
	./$(NAME) > ./test_out 2>&1
	diff ./expected ./test_out || (echo -e "[info] label_get test FAIL \e[31m -_- \e[39m" && exit 1)
	@echo "[info] label_get PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test label_get"
	cp test_out ../test_artifacts/units_label_get.txt

