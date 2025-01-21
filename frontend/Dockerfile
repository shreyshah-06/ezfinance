# Use Node.js as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the frontend application files
COPY frontend/ .

# Expose the port for React app (default is 3000)
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]
