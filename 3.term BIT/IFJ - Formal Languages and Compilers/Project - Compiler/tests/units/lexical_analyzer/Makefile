CC=gcc -std=c99 -g
NAME=test_01

build:
	@echo "[info] starting CC build for test 01"
	$(CC) *.c -o $(NAME)

test: build
	@echo "[info] performing test 01 (lexical analyser - output)"
	./$(NAME) < ./test_in > ./test_out 2>&1 -D DEBUG=2
	diff ./expected ./test_out || (echo -e "[info] test 01 FAIL \e[31m -_- \e[39m" && exit 1)
	@echo "[info] test 01 PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test 01"
	cp test_out ../test_artifacts/units_test_01.txt

