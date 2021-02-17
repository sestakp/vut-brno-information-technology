CC=gcc -std=c99 -g
NAME= precedence_stack_output

build:
	@echo "[info] starting CC build for test precedence_stack_output"
	$(CC) *.c -o $(NAME)

test: build
	@echo "[info] performing test precedence_stack_output"
	./$(NAME) > ./test_out 2>&1 -D DEBUG=2
	diff ./expected ./test_out || (echo -e "[info] precedence_stack_output test FAIL \e[31m -_- \e[39m" && exit 1)
	@echo "[info] test  PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test precedence_stack_output"
	cp test_out ../test_artifacts/units_test_precedence_stack_output.txt

