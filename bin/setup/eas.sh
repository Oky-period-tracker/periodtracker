#!/bin/bash
#
# Copy the active eas.json to app/eas.json where the EAS CLI reads from.
# When OKY_PRIVATE_RESOURCES=1 and the private resources overlay is
# present at app/src/resources-global/, use its eas.json. Otherwise use
# the public baseline at app/src/resources/.

set -e

flag="$OKY_PRIVATE_RESOURCES"
if [ -z "$flag" ] && [ -f app/.env ]; then
    flag=$(grep -E '^[[:space:]]*OKY_PRIVATE_RESOURCES=' app/.env | head -1 | cut -d= -f2- | tr -d '[:space:]"')
fi

SRC="app/src/resources/eas.json"
if [ "$flag" = "1" ] && [ -f "app/src/resources-global/eas.json" ]; then
    SRC="app/src/resources-global/eas.json"
fi

cp "$SRC" app/eas.json
