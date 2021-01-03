#!/bin/bash

for ((i = 1; i <= $#; i++)); do
  printf "%s\$^\$" "${!i}"
done
