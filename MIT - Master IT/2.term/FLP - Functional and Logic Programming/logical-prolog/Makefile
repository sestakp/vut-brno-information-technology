

ZIP_NAME =  flp-log-xsesta07.zip

run:
	#swipl flp22-log.pl ./test/test1.in
	swipl -G16g -g start -o flp22-log -c flp22-log.pl

test: FORCE
	@echo "Running tests"
	@swipl --quiet --nodebug flp22-log.pl ./test/test1.in -t halt > ./test/test1.plout
	@if diff -w ./test/test1.plout ./test/test1.out ; then \
		echo "Test 1 passed" ; \
	else \
		echo "Test 1 failed" ; \
	fi

	@swipl --quiet --nodebug flp22-log.pl ./test/test2.in -t halt > ./test/test2.plout
	@if diff -w ./test/test2.plout ./test/test2.out ; then \
		echo "Test 2 passed" ; \
	else \
		echo "Test 2 failed" ; \
	fi

	@swipl --quiet --nodebug -g "halt." flp22-log.pl ./test/test3.in -t halt > ./test/test3.plout 2>/dev/null
	@if diff -w ./test/test3.plout ./test/test3.out ; then \
		echo "Test 3 passed" ; \
	else \
		echo "Test 3 failed" ; \
	fi

	@swipl --quiet --nodebug -g "halt." flp22-log.pl ./test/test4.in -t halt > ./test/test4.plout 2>/dev/null
	@if diff -w ./test/test4.plout ./test/test4.out ; then \
		echo "Test 4 passed" ; \
	else \
		echo "Test 4 failed" ; \
	fi

FORCE:

submit:
	zip -r $(ZIP_NAME) flp22-log.pl Makefile test doc