#!/bin/bash

# Check if the user ID and directory path are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <user_id> <directory_path>"
  exit 1
fi

# Assign the arguments to variables
USER_ID=$1
DIRECTORY_PATH=$2
LOGS_PATH=$3

# Create a directory with the user ID as the name
mkdir -p "$DIRECTORY_PATH/$USER_ID"
mkdir -p "$LOGS_PATH/$USER_ID"

echo "Directory created for user ID: $USER_ID at $DIRECTORY_PATH"