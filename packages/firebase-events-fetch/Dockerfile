# Use Node.js 18-alpine image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock for dependency installation
COPY package.json ./

# Install dependencies
RUN yarn install

# Install ts-node and typescript globally (needed to run ts-node commands)
RUN yarn global add ts-node typescript

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application using ts-node
CMD ["yarn", "start"]
