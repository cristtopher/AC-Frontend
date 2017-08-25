FROM node:boron
MAINTAINER Cristtopher Quintana T. <cquintana@axxezo.com>
# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm install -g @angular/cli
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 8080

# Build app
CMD ["ng","build -aot -e prod"]
RUN mv /usr/src/app/node_modules /usr/src/app/dist

# Serve the app
CMD ["npm", "start"]
