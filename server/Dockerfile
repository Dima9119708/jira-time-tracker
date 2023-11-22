# Node serves as the runtime environment for JavaScript, hence we use it as our base image.
FROM node:20-alpine

# We set /appRoot as the working directory within the container
WORKDIR /app

# We copy package.json and package-lock.json into the /appRoot directory in the container
COPY package*.json ./

# The dependencies are installed in the container
RUN npm install

# The rest of the code is copied into the container
COPY . .

# Port 3000 is exposed to enable access from outside
EXPOSE 8000

# The command required to run the appRoot is specified
CMD [ "node", "app2.js" ]
