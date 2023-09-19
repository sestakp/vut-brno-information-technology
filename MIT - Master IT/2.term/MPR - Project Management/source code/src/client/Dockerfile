FROM httpd:alpine3.17 AS base
EXPOSE 80

FROM base AS final
COPY ./client/build /usr/local/apache2/htdocs/
COPY ./client/httpd.conf /usr/local/apache2/conf/httpd.conf