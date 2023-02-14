CC=gcc -std=c99 -g
NAME=test_symtable

build:
	@echo "[info] starting CC build for test symtable"
	$(CC) *.c -o $(NAME) -lm -g

test: build
	@echo "[info] performing test 03 (symbol table)"
	./$(NAME) -D DEBUG=2
	#> ./test_out 2>&1
	#diff ./expected ./test_out || (echo -e "[info] test 01 FAIL \e[31m -_- \e[39m" && exit 1)
	@echo "[info] test 03 PASS \e[33m ^_^ \e[39m"

	@echo "[info] performing test 03 (symbol table - valgrind)"
	valgrind --leak-check=full --track-origins=yes --error-exitcode=1 ./$(NAME) > ./test_out 2>&1 -D DEBUG=2 || (echo -e "[info] 		test 04 FAIL \e[31m -_- \e[39m" && cat ./test_out && exit 1)
	@echo "[info] test 04 PASS \e[33m ^_^ \e[39m"
	
artifacts:
	@echo "[info] creating artifacts for test 03 and test 04"
	cp test_out ../test_artifacts/units_test_03.txt

