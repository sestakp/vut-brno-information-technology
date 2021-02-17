CC=gcc -std=c99 -g
NAME=precedence_stack_valgrind

build:
	@echo "[info] starting CC build for test precedence_stack_valgrind"
	$(CC) *.c -o $(NAME)

test: build
	@echo "[info] performing precedence_stack_valgrind test"
	valgrind --leak-check=full --track-origins=yes --error-exitcode=1 ./$(NAME) > ./test_out 2>&1 -D DEBUG=2 || (echo -e "[info] test 02 FAIL \e[31m -_- \e[39m" && cat ./test_out && exit 1)
	@echo "[info] precedence_stack_valgrind test PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test precedence_stack_valgrind"
	cp test_out ../test_artifacts/units_test_precedence_stack_valgrind.txt

