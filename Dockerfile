# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port 8080
EXPOSE 8080

# Start server
CMD ["serve", "-s", "dist", "-l", "8080"] 