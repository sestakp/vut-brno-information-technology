NAME=compiler
ARCHIVE=xsesta07.zip

build: submission
	mkdir build
	cd submission && $(MAKE) build
	cp submission/$(NAME) build
	rm submission/$(NAME)

debug: submission
	mkdir build
	cd submission && $(MAKE) debug
	cp submission/$(NAME) build
	rm submission/$(NAME)

archive: submission
	cd submission/ && zip -r ../$(ARCHIVE) *

submission: tex
	@echo "[info] make dir ./submission"
	mkdir submission
	@echo "[info] copy files to ./submission"
	cp include/* submission
	cp src/* submission
	cp Makefile_submission submission/Makefile
	#cp doc/documentation.pdf submission/dokumentace.pdf
	#cp doc/Rozdeleni submission
	#cp doc/

test: build archive
	@echo "[info] create tests artifacts dir"
	mkdir ./test_artifacts
	@echo "[info] starting units tests"
	# for all dirs in ./tests/units
	for f in ./tests/units/*; do \
		if [ -d "$$f" -a $$(echo -n "$$f" | tail -c 1) != "-" ]; then \
			mkdir ./test-submission/ && \
			cp -r ./submission/* ./test-submission/ && \
			rm ./test-submission/compiler.c && \
			cp -r $$f/* ./test-submission/ && \
			cd ./test-submission && $(MAKE) test && $(MAKE) artifacts && \
			cd ../ && \
			rm -rf ./test-submission/; \
		fi \
	done
	@echo "[info] starting whole tests"
	# for all dirs in ./tests/whole
	for f in ./tests/whole/*; do \
		if [ -d "$$f" -a $$(echo -n "$$f" | tail -c 1) != "-" ]; then \
			mkdir ./test-submission/ && \
			cp -r ./submission/* ./test-submission/ && \
			rm ./test-submission/compiler.c && \
			cp -r $$f/* ./test-submission/ && \
			cd ./test-submission && $(MAKE) test && $(MAKE) artifacts && \
			cd ../ && \
			rm -rf ./test-submission/; \
		fi \
	done
	# end for
	
speedtest:
	# implement tests

tex:
	@echo "[info] building pdflatex"
	cd ./doc && pdflatex -quiet -interaction=batchmode ./documentation.txt > /dev/null 2>&1 || true

documentation: tex
	@echo "[info] building doc"
	doxygen

stats:
	@echo "[info] get stats"
	src=$$(wc -l $$(find ./src -iname "*.c") | awk  'END{print $$1}') && \
	include=$$(wc -l $$(find ./include -iname "*.h") | awk  'END{print $$1}') && \
	tests=$$(wc -l $$(find ./tests -iname "*.c") | awk  'END{print $$1}') && \
	all=$$((src + include + tests)) && \
	echo "src: $$src" && \
	echo "include: $$include" && \
	echo "tests: $$tests" && \
	echo "all: $$all"

clean:
	@echo "[info] delete ./build"
	rm -rf build/
	@echo "[info] delete ./submission"
	rm -rf submission/
	rm -rf test-submission/
	@echo "[info] tests clean"
	rm -rf ./test_artifacts
	@echo "[info] delete archive"
	rm -f $(ARCHIVE)
	@echo "[info] delete doxygen documentation"
	rm -rf doc/doxygen
	@echo "[info] delete pdflatex"
	rm -f ./doc/documentation.pdf
	rm -f ./doc/documentation.toc
	rm -f ./doc/documentation.log
	rm -f ./doc/documentation.aux

compile:
	@echo "[info] Start compiling simple.go"
	./build/compiler <simple.go >outofcompiler.ifjcode20
	@echo "[info] Start interpretting outofcompiler.ifjcode20\n\n"
	./ic20int outofcompiler.ifjcode20
	@echo "\n\n[info] Removing temp files"
	rm outofcompiler.ifjcode20
	
	
	for f in ./tests/units/syntax_analyzer_whole/correct/*; do \
		if [ -f "$$f" ]; then \
			echo "Start compiling $$f"; \
			./build/compiler <$$f >outofcompiler.ifjcode20; \
			./ic20int outofcompiler.ifjcode20; \
			if [ $$? -ne 0 ]; then \
        		echo "fail in $$f return code $$?"; \
				cat test_out; \
        		exit 1; \
			else \
				echo "success in $$f return code $$?"; \
    		fi; \
			rm outofcompiler.ifjcode20; \
		fi; \
	done