# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /cloud

# Copy the application files into the working directory
COPY . /cloud

# Скопируйте файл package.json в рабочую директорию
COPY package.json ./cloud

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]
