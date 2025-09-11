#!/bin/bash
VARIABLES=("NEXT_PUBLIC_PLAYER_PARSER_URL" "NEXT_PUBLIC_API_URL")

NEXT_PUBLIC_PLAYER_PARSER_URL=${NEXT_PUBLIC_PLAYER_PARSER_URL:-""}
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-"/api/proxy"}

find /app/public /app/.next -type f -name "*.js" |
while read file; do
    for VAR in "${VARIABLES[@]}"; do
        sed -i "s|BAKED_$VAR|${!VAR}|g" "$file"
    done
done
