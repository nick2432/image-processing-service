# Use official Node.js LTS image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port (if running inside a container)
EXPOSE 5000

# Define the command to run the application
CMD ["node", "server.js"]
