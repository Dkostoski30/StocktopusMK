#!/bin/bash
if [ -f /app/pipe.py ] && pgrep -f "python pipe.py" > /dev/null; then
  exit 0
else
  exit 1
fi