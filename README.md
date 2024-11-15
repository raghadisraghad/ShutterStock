# MERN Stack Application for Moroccan ShutterStock

## Overview
*"MongoDB - Express.js - React - Node.js"* shutterstock, a moroccan version that offers a wide range of high-quality stock images, videos, music tracks, and editorial content for creators, businesses, and marketers to visual their projects, such as advertisements, websites, and social media posts.

Users can access Shutterstock's library through subscriptions or by purchasing individual downloads, making it easy to find the right content for any need. Shutterstock supports artists and photographers by allowing them to sell their work, creating a community of contributors from around the world.

## Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 23.0.0 or later)
- [MongoDB](https://www.mongodb.com/) (if using locally, or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud database)

## Clone the Repository
Clone this repository to your local machine using:
```bash
git clone https://github.com/raghadisraghad/ShutterStock.git
cd ShutterStock
```

## Configuration for the Backend 

```bash
cd backend
npm install

```
### Explanation
this will install all the dependencies needed to configure the backend



## Configuration for the FrontEnd 

```bash
cd frontend
npm install
```
### Explanation
this will install all the dependencies needed to configure the frontend


## Run Both the Server and Client

```bash
cd backend
npm run dev
```

or using docker

```bash
docker-compose up --build
```

this will build all the images and dependencies needed to run the app using a cloud mongodb