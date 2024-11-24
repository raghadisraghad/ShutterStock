FROM node:23

RUN mkdir -p /app/node_modules && chown -R node:node /app
RUN mkdir -p /app/uploads
RUN mkdir -p /app/uploads/Users
RUN mkdir -p /app/uploads/Products

WORKDIR /app

ENV NODE_OPTIONS="--trace-warnings"

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
