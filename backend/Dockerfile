# Use Node.js as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the backend application files
COPY backend/ .

# Copy the backend's .env file into the container
COPY backend/.env .env

# Expose the port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
