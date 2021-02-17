CC=gcc -std=c99 -g
NAME=syntax_analyzer_whole_output

build:
	@echo "[info] starting CC build for syntax analyzer whole test"
	$(CC) *.c -D DEBUG=3 -o $(NAME)

test: build
	@echo "[info] performing test syntax analyzer whole (output)"
	for f in ./correct/*; do \
		if [ -f "$$f" ]; then \
			echo "testing $$f source code"; \
			valgrind --leak-check=full --track-origins=yes --error-exitcode=1 ./$(NAME) < $$f >> test_out 2>&1 && echo "success in $$f return code $$?"; \
			if [ $$? -ne 0 ]; then \
        		echo "fail in $$f return code $$?"; \
				cat test_out; \
        		exit 1; \
    		fi; \
		fi \
	done
	for f in ./incorrect/*; do \
		if [ -f "$$f" ]; then \
			echo "testing $$f source code"; \
			valgrind --leak-check=full --track-origins=yes --error-exitcode=1 ./$(NAME) < $$f >> test_out 2>&1; \
			if [ $$? -eq 0 ]; then \
        		echo "fail in $$f return code $$?"; \
				cat test_out; \
        		exit 1; \
			else \
				echo "success in $$f return code $$?"; \
    		fi; \
		fi \
	done
	@echo "[info] syntax analyzer whole test PASS \e[33m ^_^ \e[39m"

artifacts:
	@echo "[info] creating artifacts for test 01"
	cp test_out ../test_artifacts/syntax_analyzer_whole_output.txt

