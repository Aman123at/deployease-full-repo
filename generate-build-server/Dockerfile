FROM node


WORKDIR /home/app

COPY . .

RUN npm install

RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT [ "/home/app/main.sh" ]