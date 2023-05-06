
# Use the official Node.js image as the base image
FROM node:12

# Set the working directory in the container
WORKDIR /app/usr

# Copy the application files into the working directory
COPY . /app/usr

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]
