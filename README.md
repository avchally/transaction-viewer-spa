# Transaction  Viewer Single-Page Application

This is a simple application that displays financial transactions with the ability to view a more detailed page. This project utilizes a containerized backend through Docker, involving PostgreSQL and Node.js with Prisma and Apollo Server. The frontend is built with the Nuxt.js (Vue.js) framework, styled with Tailwind CSS, and interfaces with the backend through Apollo-Vue. 


# Setup

## Backend
After cloning the repo, make sure you have Docker installed on your system.
*Note: the included .env file already has some default configuration set up; feel free to adjust if desired.
Navigate to ~/backend and run the following command to start the container, the PostgreSQL database, and the backend server:  

`docker-compose up -d --build`  

To finish setting up the database (and seed it with data), go to the prisma-apollo-api's container from Docker Desktop and enter its CLI. Enter the following commands from the container:  

`npx prisma migrate dev`  
`npx prisma db seed`  

When prompted to enter a name for the new migration, just press enter.
The backend is now set up!

## Frontend
Navigate to ~/frontend and run:  

`npm install`  

After the dependencies are installed, run the server with:  

`npm run dev`  

The app is now set up and running.
