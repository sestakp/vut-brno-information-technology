CC=gcc -std=c99 -g
NAME=data_type_queue_test_valgrind

build:
	@echo "[info] starting CC build for test data_type_queue_test_valgrind"
	$(CC) *.c -o $(NAME) -D DEBUG=3

test: build
	@echo "[info] performing test data_type_queue_test_valgrind"
	valgrind --leak-check=full --track-origins=yes --error-exitcode=1 ./$(NAME) > ./test_out 2>&1 -D DEBUG=2 || (echo -e "[info] test 02 FAIL \e[31m -_- \e[39m" && cat ./test_out && exit 1)
	@echo "[info] data_type_queue_test_valgrind test PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test data_type_queue_test_valgrind"
	cp test_out ../test_artifacts/units_data_type_queue_test_valgrind.txt

