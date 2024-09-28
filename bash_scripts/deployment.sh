#!/bin/bash

# Function to print error messages and exit
function error_exit {
    echo "$1" 1>&2
    exit 1
}

if [ "$#" -ne 2 ]; then
    error_exit "Please make sure you have supplied the directory name and zip file"
fi

echo "App Build has initialized extracting files now"

ZIP_FILE=$1
DEST_DIR=$2

if [ ! -f "$ZIP_FILE" ]; then
    error_exit "Error: Zip file '$ZIP_FILE' not found!"
fi

# Create a subdirectory named after the zip file (without the .zip extension)
BASE_NAME=$(basename "$ZIP_FILE" .zip)
SUB_DIR="$DEST_DIR/$BASE_NAME"
mkdir -p "$SUB_DIR"

# Extract the zip file into the subdirectory
echo "Extracting '$ZIP_FILE' to '$SUB_DIR'..."
unzip -o "$ZIP_FILE" -d "$SUB_DIR" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Extraction Successful!"
    rm -r "$ZIP_FILE"
else
    error_exit "Error: Extraction Failed! Check if the zip file is valid and not corrupted."
fi

# Get the name of the top-level directory inside the extracted folder
EXTRACTED_FOLDER=$(ls -1 "$SUB_DIR" | head -n 1)

if [ -z "$EXTRACTED_FOLDER" ]; then
    error_exit "Error: No extracted folder found!"
fi

# Change directory to the extracted folder
cd "$SUB_DIR/$EXTRACTED_FOLDER" || error_exit "Error: Failed to change directory to '$SUB_DIR/$EXTRACTED_FOLDER'"

# Create Dockerfile
cat <<EOL > Dockerfile
# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOL

# Build the Docker image
docker build -t "$BASE_NAME" .

# Run the Docker container, mapping port 80 in the container to a random available port on the host
CONTAINER_ID=$(docker run -d -P "$BASE_NAME")

# Get the dynamically assigned port
HOST_PORT=$(docker port "$CONTAINER_ID" 80 | cut -d: -f2)

echo "Application is running on port $HOST_PORT"