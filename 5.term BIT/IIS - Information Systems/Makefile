.ONESHELL:
mkfile_path := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

client-dev-up:
	cd clienApp
	npm install
	npm start

api-dev-up:
	cd serverAPI
	docker run --rm -v $(mkfile_path)/serverAPI:/app composer install
	cp .env.example .env
	docker-compose up

api-migrate:
	cd serverAPI
	docker-compose exec laravel.test php artisan migrate

api-release-up:
	cd serverAPI
	docker run --rm -v $(mkfile_path)/serverAPI:/app composer install
	cp .env.release .env
	chmod 777 -R *
	docker-compose up --detach
