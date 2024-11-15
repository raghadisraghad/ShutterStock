FROM node:23

WORKDIR /app

ENV NODE_OPTIONS="--trace-warnings"

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"] 