#! /bin/bash

folder="/Users/mingjun/bad-apple/ascii"

for file in "$folder"/*; do
    filename=$(basename "$file")
    key=$(echo "$filename" | sed -E 's/out-(.*)\.txt/\1/' | sed 's/^0*//')
    content=$(cat "$file")
    echo "$key: Uploading $filename"
    npx wrangler kv key put --binding=BAD_APPLE_DATA "$key" "$content" --remote
done

#npx wrangler kv bulk put output.json --binding=BAD_APPLE_DATA --namespace-id=3812cae70865463699b7fb9295d4a89b --remote