
<p align="center">
<!-- <img height="200px" src="https://.png" alt="Loading img..."/> -->
</p>
<h1 align="center"> KraftBase Task </h1>
This Project is developed for Kraftbase as a task. Use Without any information violates policy.

## Before You Begin
Before you begin, we recommend you read about the basic building blocks that assemble this website:

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
- Git - Download & Install Git typically have this already installed.
- VS Code - Download & Install VS Code, one of the most popular code - editor developed by Microsoft.

### Backend:
- Nodejs, MongoDB, Express, Kafka, Docker, Redis, Discord, Prometheus, Grafana

## Get Started
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting to run the website

### Get started with Backend

### Working with repo:
1. Clone the repo in which you must work in your system.
2. Create or do your work in another branch with a relevant name.
3. After completing your work, commit your changes and push them.
4. Create a pull request (PR).

### Setting up the project(Backend) :

1. Navigate to service folder

```bash
    cd DeliveryAgent
```
2. Installing dependencies:
```bash
npm install
```

3. setup the .env file as given .env.example: 
```bash
 mkdir .env
```
4. Start the development server: 
```bash
npm run dev
```
4. Start the production server: 
```bash
npm start
```

### With Docker

1. Navigate to service folder

```bash
    cd DeliveryAgent
```

2. setup the .env file as given .env.example: 
```bash
 mkdir .env
```

3. Build Docker image 

```bash
    docker build -t <image_name>
```

4. Build Docker image 

```bash
    docker run --publish 5500:5500 <app name>
```

## Service is Live
- You can now hit the api endpoint.