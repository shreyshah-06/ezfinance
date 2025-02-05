# EZFinance - Streamlining Business Management for SMEs

## Live Demo
[Link to Live Demo](https://ez-finance-shrey.netlify.app/)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Deployment](#setup-and-deployment)
  - [Local Setup](#local-setup)
  - [Dockerized Setup](#dockerized-setup)
- [Usage](#usage)
- [Contributor](#contributor)

## Introduction

EZFinance is a comprehensive platform tailored to streamline business management processes for small and medium-sized enterprises (SMEs). It empowers business owners with a user-centric interface and interactive dashboards, delivering real-time insights and simplifying operations. With significant enhancements, the platform is optimized for performance, achieving seamless scalability and efficiency.

## Features

- **Business Management Tools**: Centralizes and simplifies processes like expense tracking, invoicing, and analytics.
- **Real-Time Insights**: Interactive dashboards with live updates for data-driven decision-making.
- **Scalable Architecture**: Supports growing business needs with optimized performance.
- **Enhanced Performance**: Improved query execution time by 20% for faster operations.
- **Secure and Reliable**: Built with robust authentication and AWS RDS-hosted databases.
- **Database Optimization**: Implements database normalization and transaction control for efficient and modern DBMS practices.
- **Dockerized Setup**: Easily deploy the platform using Docker for consistent, reliable, and fast setup across different environments.

## Technologies Used

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL hosted on AWS RDS
- **ORM**: Sequelize
- **Docker**: Dockerized containers for frontend and backend services to simplify deployment and ensure consistency across different environments.

## Setup and Deployment

To install and run EZFinance locally, follow these steps:

### Local Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/shreyshah-06/ezfinance.git
    ```

2. Navigate to the project directory:

    ```bash
    cd ezfinance
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up the database:

    - **For Local Setup**: Ensure **PostgreSQL** is installed and running locally on your machine.
    - **For AWS RDS Setup**: Ensure your **AWS RDS** instance is configured and accessible.
    - Set the `DATABASE_URL` environment variable with the connection string for your PostgreSQL database.

5. Run migrations to set up the database:

    ```bash
    npx sequelize-cli db:migrate
    ```

6. Start the backend server:

    ```bash
    cd backend
    npm start
    ```

7. Start the frontend server:

    ```bash
    cd frontend
    npm start
    ```

8. Access the application:

    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: Ensure it runs on port `5000`.

### Dockerized Setup

To run EZFinance with Docker, follow these steps:

1. Clone the repository and navigate to the project directory:

    ```bash
    git clone https://github.com/shreyshah-06/ezfinance.git
    cd ezfinance
    ```

2. Build the Docker containers:

    ```bash
    docker-compose up --build
    ```

    This command will build both the frontend and backend containers based on the Dockerfiles and start them.

3. Access the application:

    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: The backend will be accessible on port `5000`.

4. To stop the Docker containers:

    ```bash
    docker-compose down
    ```

This setup uses Docker to streamline the deployment and eliminates the need for manual installations of dependencies or database setup.

## Usage

Unlock the full potential of EZFinance with these steps:

- **Experience the Platform**: Access the [Live Demo](https://ez-finance-shrey.netlify.app/) or set up the project locally or with Docker for hands-on exploration.
- **Simplify Business Operations**: Leverage interactive dashboards to seamlessly manage invoices, monitor expenses, and track performance metrics in real-time.
- **Secure Your Data**: Log in with robust authentication to gain personalized insights and ensure data privacy.

## Contributor

This project is developed and maintained by **Shrey Shah**.

For queries or contributions, feel free to reach out via GitHub.

---
