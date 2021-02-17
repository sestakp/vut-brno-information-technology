CC=gcc -std=c99 -g
NAME=data_type_queue_test_output

build:
	@echo "[info] starting CC build for test data_type_queue_test_output"
	$(CC) *.c -o $(NAME) -D DEBUG=3

test: build
	@echo "[info] performing test data_type_queue_test_output"
	./$(NAME) > ./test_out 2>&1
	diff ./expected ./test_out || (echo -e "[info] data_type_queue_test_output test FAIL \e[31m -_- \e[39m" && exit 1)
	@echo "[info] data_type_queue_test_output PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test data_type_queue_test_output"
	cp test_out ../test_artifacts/units_data_type_queue_test_output.txt

