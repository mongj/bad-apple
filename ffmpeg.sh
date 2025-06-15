#!/bin/bash

rm -rf temp
rm -rf frames

mkdir temp
mkdir frames

ffmpeg -i "video.mp4" -filter:v scale=360:-1 -c:a copy temp/video.mp4
ffmpeg -i "temp/video.mp4" -vf "fps=8" -q:v 10 "frames/out-%03d.jpg"

rm -rf temp
