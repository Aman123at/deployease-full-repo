#!/bin/bash

export REPO_URL="$REPO_URL"
git clone "$REPO_URL" /home/app/output

exec node script.js