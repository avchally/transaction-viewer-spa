# Transaction  Viewer Single-Page Application

This is a simple application that displays financial transactions with the ability to view a more detailed page.  

This project utilizes a containerized backend through Docker, involving PostgreSQL and Node.js with Prisma and Apollo Server. The frontend is built with the Nuxt.js (Vue.js) framework, styled with Tailwind CSS, and interfaces with the backend through Apollo-Vue. 


# Setup

## Backend
After cloning the repo, make sure you have Docker installed on your system.  
> **_NOTE:_** the included .env file already has some default configuration set up; feel free to adjust if desired.

Navigate to ~/backend and run the following command to start the container, the PostgreSQL database, and the backend server:  

`docker-compose up -d --build`  

To finish setting up the database (and seed it with data), run the following commands. `docker exec {name}` runs the command from within the docker container:  

`docker exec prisma-apollo-api npx prisma migrate dev`  
`docker exec prisma-apollo-api npx prisma db seed`  

The backend is now set up! The database can be viewed through pgAdmin at `http://localhost:5555/`  

## Frontend
Navigate to ~/frontend and run:  

`npm install`  

After the dependencies are installed, run the server with:  

`npm run dev`  

The app is now set up and running. It can be accessed at `http://localhost:3000/`
