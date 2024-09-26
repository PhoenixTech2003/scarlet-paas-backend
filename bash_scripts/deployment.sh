#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Please make sure you have supplied the directory name and zip file"
    exit 1
fi

echo "App Build has initialized extracting files now"

ZIP_FILE=$1
DEST_DIR=$2

if [ ! -f "$ZIP_FILE" ]; then
    echo "Error: Zip file '$ZIP_FILE' not found!"
    exit 1
fi

unzip "$ZIP_FILE" -d "$DEST_DIR"

if [ $? -eq 0 ]; then
    echo "Extraction Successful!"
    rm -r "$ZIP_FILE"
else
    echo "Error: Extraction Failed!"
    exit 1

fi