FROM node:18.12.1-alpine
COPY . .
RUN npm ci
RUN npm test
EXPOSE 5000
ENTRYPOINT ["npm", "start"]
