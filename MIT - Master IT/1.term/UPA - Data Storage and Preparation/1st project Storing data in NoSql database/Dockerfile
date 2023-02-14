FROM alpine

#install python
RUN apk add python3 py3-pip make

#add code
ADD * /app/
RUN cd /app && \
    rm -f requirements_done && \
    make requirements_done
