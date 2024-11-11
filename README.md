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
npm install express mongoose axios dotenv cors bcryptjs jsonwebtoken cookie-parser express-async-handler
npm i -D nodemon multer

```
*[Backend README](https://github.com/raghadisraghad/ShutterStock/tree/main/backend/README.md).*

### Explanation
express : the framework we will be working with
mongoose : the mongoDB
axios : facilitate using endpoints inside other endpoints or functions
dotenv : to be able to use the .env file
cors : to be enable the requests from different origins and share the appropriate headers
bcryptjs : for securing passwords
jsonwebtoken : to be able to generate and verify json web tokens
cookie-parser : to be able to create cookies and control them
express-async-handler : to handle async inside functions and methods without using try and catch
nodemon : allows auto saving the code modifications without stopping the backend server
multer : for uploading images



## Configuration for the FrontEnd 

```bash
npm i -D concurrently
```
*[FrontEnd README](https://github.com/raghadisraghad/ShutterStock/tree/main/frontend/README.md).*

### Explanation
concurrently : to be able to run multiple development environment at once


## Run Both the Server and Client

```bash
npm run dev
```