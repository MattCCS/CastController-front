FROM node:12.18.1

WORKDIR /app

ADD . /app

ENV REACT_APP_PROXY "http://localhost:11001"

CMD ["npm", "start"]
