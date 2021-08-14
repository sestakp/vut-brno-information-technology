LOGIN = xsesta07
CC = g++
BIN_NAME = ipk-sniffer
SOURCE_CODE = ipk-sniffer

.PHONY: clean all

all: clean build

build: $(SOURCE_CODE).o
	$(CC) -o $(BIN_NAME) $(SOURCE_CODE).o -lpcap

%.o : %.cpp %.hpp
	$(CC) -c $< -o $@

submit: clean
	tar -czvf $(LOGIN).tar makefile readme.md manual.pdf ipk-sniffer.cpp ipk-sniffer.hpp

clean:
	rm -f *.o
	rm -f $(BIN_NAME)
	rm -f $(LOGIN).tar