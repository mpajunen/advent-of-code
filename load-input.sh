#!/usr/bin/env sh

YEAR=${2:-$(date "+%Y")}
DAY=${1:-$(date "+%-d")}

curl --header "Cookie: session=$AOC_SESSION" \
  --output "./$YEAR/input/day$DAY.txt" \
  "https://adventofcode.com/$YEAR/day/$DAY/input"
