#!/bin/bash
#
# Seed a fresh database with the schema, tables, and a temporary CMS admin
# user. Requires the postgres container from docker-compose to be running.
# Intended for first-time local setup. Drops and recreates the periodtracker
# schema, so do NOT run this against a database that contains real data.

set -e

POSTGRES_CONTAINER=$(docker ps -qf "name=postgres" | head -n1)

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "No running postgres container found. Start the backend first with 'yarn dev'."
    exit 1
fi

if [ "$1" != "--force" ] && [ "$1" != "-y" ]; then
    echo "WARNING: this will DROP the 'periodtracker' schema and recreate it."
    echo "All data in that schema will be lost."
    echo ""
    read -r -p "Continue? [y/N] " answer
    case "$answer" in
        y|Y|yes|YES) ;;
        *) echo "Aborted."; exit 1 ;;
    esac
fi

run_sql() {
    docker exec -i "$POSTGRES_CONTAINER" \
        psql -U periodtracker -d periodtracker -v ON_ERROR_STOP=1 "$@"
}

echo "Resetting schema periodtracker..."
run_sql -c 'DROP SCHEMA IF EXISTS periodtracker CASCADE; CREATE SCHEMA periodtracker;' > /dev/null

echo "Applying sql/initial-setup.sql..."
run_sql < sql/initial-setup.sql > /dev/null

echo "Inserting temporary admin user (username: admin, password: admin)..."
run_sql <<'SQL' > /dev/null
INSERT INTO "periodtracker"."user" ("id", "username", "password", "lang", "date_created", "type")
VALUES (-1, 'admin', '$2b$10$cslKchhKRBsWG.dCsspbb.mkY9.opLl1t1Oxs3j2E01/Zm3llW/Rm', 'en', NOW(), 'superAdmin');
SQL

# Optional: insert translation content. The translations submodule may ship
# insert-content-<lang>.sql files. Apply any that are present.
TRANS_DIR="packages/core/src/common/translations"
if compgen -G "$TRANS_DIR/insert-content-*.sql" > /dev/null; then
    echo "Applying translation content SQL from $TRANS_DIR..."
    for f in "$TRANS_DIR"/insert-content-*.sql; do
        echo "  $(basename "$f")"
        run_sql < "$f" > /dev/null
    done
else
    echo "No insert-content-*.sql found in $TRANS_DIR, skipping content seed."
    echo "See docs/localisation/translations.md for how to generate them."
fi

echo ""
echo "Database ready."
echo "CMS: http://localhost:5000  (login: admin / admin)"
echo "Adminer: http://localhost:8080"
echo ""
echo "IMPORTANT: once logged in, create a real user via /user-management"
echo "with a strong password, log out, log in as the new user, and delete"
echo "the temporary 'admin' account."
