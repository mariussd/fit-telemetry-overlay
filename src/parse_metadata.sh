#!/bin/bash

# Change to the directory containing the MP4 files
cd ../public/ || exit

# Loop through all .MP4 files
for file in *.MP4; do
  # Extract the base file name without the extension
  base_name="${file%.MP4}"
  
  # Use exiftool to extract metadata and save it to a JSON file
  exiftool -j "$file" > "${base_name}.json"
  
  # Print a message for each file processed
  echo "Metadata for $file saved to ${base_name}.json"
done