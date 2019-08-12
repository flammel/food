#! /bin/sh

for size in 16 150 180 192 512
do
    convert -density 1200 -resize ${size}x${size} icon.svg public/icon-${size}.png
done
