# EZFinance - Streamlining Business Management for SMEs

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

EZFinance is a platform designed to streamline business management processes for small and medium-sized enterprises (SMEs). It provides a user-centric interface with interactive dashboards, enabling real-time insights for business owners. The application's performance has been optimized, achieving a 20% improvement in query execution time for enhanced usability.

## Features

- Streamlines business management processes
- Optimizes application performance
- Provides user-centric interface with interactive dashboards
- Enables real-time insights for business owners

## Technologies Used

- Node.js
- Express.js
- React.js
- PostgreSQL
- Bootstrap
- Sequelize

## Installation

To install and run EZFinance locally, follow these steps:

1. Clone the repository to your local machine:

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
4. Set up the PostgreSQL database and configure the connection in the config/config.json file.
5. Run the database migrations to create the necessary tables:
   
  ```bash
  npx sequelize-cli db:migrate
  ```
6. Start the backend server:

  ```bash
  cd backend
  nodemon App.js
  ```
7. Start the frontend server:

  ```bash
cd frontend
  npm start
  ```

## Usage

To use EZFinance, follow these steps:

1. Open a web browser.

2. Navigate to `http://localhost:3000` to access the EZFinance application.

3. Ensure that the backend server is running on port `5000`.

4. Explore the user-centric interface with interactive dashboards to gain real-time insights for your business.


  


