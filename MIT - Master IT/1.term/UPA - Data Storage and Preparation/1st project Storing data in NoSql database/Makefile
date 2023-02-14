run: requirements_done
	python3	main.py

requirements_done:
	pip install -r requirements.txt
	touch requirements_done

docker:
	docker build . -t xpleva07upa
	docker run xpleva07upa python3 /app/main.py

clean:
	pip uninstall -r requirements.txt
	rm -f requirements_done