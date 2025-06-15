# Get pixels from frames



import os

from ascii_magic import AsciiArt

# Process each image in frames directory
for filename in sorted(os.listdir("frames"), key=lambda x: int(x.split("out-")[1].split(".jpg")[0])):
    my_art = AsciiArt.from_image(os.path.join("frames", filename))
    my_art.to_file(os.path.join("ascii", filename.replace(".jpg", ".txt")), monochrome=True)
    my_art.to_terminal(monochrome=True)
    print(f"Processed {filename}")