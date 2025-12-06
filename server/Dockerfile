# Use Playwright's official Node.js image with all browser dependencies pre-installed
FROM mcr.microsoft.com/playwright:v1.40.1-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy shared folder first (from parent context)
COPY ../shared ./shared

# Copy server source code
COPY . .

# Expose the application port
EXPOSE 8080

# Build the application
RUN npm run build

# Set environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
