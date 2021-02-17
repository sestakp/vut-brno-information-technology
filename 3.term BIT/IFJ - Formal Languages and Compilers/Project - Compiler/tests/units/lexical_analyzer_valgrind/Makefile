CC=gcc -std=c99 -g
NAME=test_02

build:
	@echo "[info] starting CC build for test 02"
	$(CC) *.c -o $(NAME)

test: build
	@echo "[info] performing test 02 (lexical analyser - valgrind)"
	valgrind --leak-check=full --track-origins=yes --error-exitcode=1 ./$(NAME) < ./test_in > ./test_out 2>&1 -D DEBUG=2 || (echo -e "[info] test 02 FAIL \e[31m -_- \e[39m" && cat ./test_out && exit 1)
	@echo "[info] test 02 PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test 02"
	cp ./test_out ../test_artifacts/units_test_02.txt
