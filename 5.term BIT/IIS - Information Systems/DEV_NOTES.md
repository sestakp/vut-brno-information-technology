# Project setup
## Create project
1) composer create-project laravel/laravel .

## Create database
1) mysql -uroot -p
2) CREATE DATABASE iisProject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
3) CREATE USER 'iisProject'@'localhost' identified by 'iisProject';
4) GRANT ALL on iisProject.* to 'iisProject'@'localhost';
5) quit

### Errors with database
1) /etc/php/php.ini
uncomment extension=pbo_mysql
uncomment extension=mysql



## Password authentication
https://laravel.com/docs/8.x/passport


## setup API 
php artisan migrate
php artisan key:generate

# How to launch server?
php artisan serve

# Create symlinks to access images from API
php artisan storage:link