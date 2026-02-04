# Phase 1: Use Node.js environment
FROM node:18

# Set work directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose the application port
EXPOSE 5050

# Command to run the app
CMD ["node", "index.js"]