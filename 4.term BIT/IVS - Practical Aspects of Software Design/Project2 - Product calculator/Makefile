PROFILER_OUTPUT = vystup.txt
PROFILER_INPUT = numbers.in 

all:
#translate project with profiler

node_modules:
	npm install

build: node_modules
	cp package.json.build package.json
	npm run build

clean:
#clean
	rm -f profiling/isolate*
	rm -f package-lock.json
	rm -rf node_modules

doc: node_modules
#generating doc
	npx jsdoc * -r -d doc/jsdoc
	
run: node_modules
#run application
	cp package.json.build package.json
	npm start

profile: clean node_modules
#profiling program
	cp package.json.profiler package.json
	cd profiling && npx node --prof profiler.js < $(PROFILER_INPUT) && npx node --prof-process isolate* > $(PROFILER_OUTPUT)

test: node_modules
#Math lib test
	npm test

coverage: node_modules
	npm test -- --coverage