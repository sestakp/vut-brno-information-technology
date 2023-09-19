EXECUTABLE = flp22-fun
SRCS = src/Main.hs src/Ecdsa.hs src/ParseInput.hs src/Types.hs
GHC = ghc
GHC_OPTS = -O2 -Wall --make -v
GHC_PACKAGES = base random
ZIP_NAME =  flp-fun-xsesta07.zip

$(EXECUTABLE): $(SRCS)
	ghc -O2 -Wall --make -package base -package random -o flp22-fun src/Main.hs src/Ecdsa.hs src/ParseInput.hs src/Types.hs

submit:
	zip -r $(ZIP_NAME) src Makefile test doc

clean:
	rm -f $(EXECUTABLE) src/*.o src/*.hi

