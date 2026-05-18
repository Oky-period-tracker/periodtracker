#!/bin/bash
#
# Ensure the private Oky resources repo is available when
# OKY_PRIVATE_RESOURCES=1. The repo is cloned once into
# app/src/resources-global (gitignored). Metro's resolveRequest and
# app.config.js route imports and asset paths there at build time when
# the flag is on. No file swapping, no marker, nothing to reset.
#
# Runs automatically as the first step of yarn dev and yarn dev:app.

set -e

PRIVATE_URL="${OKY_PRIVATE_RESOURCES_URL:-git@github.com:Oky-period-tracker/periodtracker_resources-global.git}"
PRIVATE_REF="${OKY_PRIVATE_RESOURCES_REF:-main}"
PRIVATE_DIR="app/src/resources-global"

# Fallback to app/.env if the shell did not set the flag
if [ -z "$OKY_PRIVATE_RESOURCES" ] && [ -f app/.env ]; then
    value=$(grep -E '^[[:space:]]*OKY_PRIVATE_RESOURCES=' app/.env | head -1 | cut -d= -f2- | tr -d '[:space:]"')
    [ -n "$value" ] && OKY_PRIVATE_RESOURCES="$value"
fi

if [ "$OKY_PRIVATE_RESOURCES" = "1" ]; then
    if [ ! -d "$PRIVATE_DIR/.git" ]; then
        echo "Cloning private resources into $PRIVATE_DIR..."
        rm -rf "$PRIVATE_DIR"
        git clone --branch "$PRIVATE_REF" --quiet "$PRIVATE_URL" "$PRIVATE_DIR"
    else
        (cd "$PRIVATE_DIR" && git fetch --quiet origin "$PRIVATE_REF") || true
    fi
    echo "Private resources ready at $PRIVATE_DIR. Metro + app.config.js will route through it."
fi

# Refresh app/eas.json from the active source based on the flag.
./bin/setup/eas.sh
