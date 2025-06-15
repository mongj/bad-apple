import glob
import json
import os


def read_ascii_files():
    # Get all files matching the pattern out-*.txt in the ascii folder
    file_paths = sorted(glob.glob('ascii/out-*.txt'))
    
    result = []
    
    for file_path in file_paths:
        # Extract the number from the filename (e.g., "001" from "out-001.txt")
        file_name = os.path.basename(file_path)
        key = file_name.replace('out-', '').replace('.txt', '')
        
        # Remove leading zeros from the key
        key = str(int(key))
        
        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Add to result list
        result.append({
            "key": key,
            "value": content
        })
        print(f"Processed {file_path}")
    
    # Convert to JSON and write to file
    with open('output.json', 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, indent=2, ensure_ascii=True)
    
    print(f"Successfully processed {len(result)} files into output.json")

if __name__ == "__main__":
    read_ascii_files()
