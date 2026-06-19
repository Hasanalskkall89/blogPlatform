# Use a specific version of PostgreSQL for better stability
FROM postgres:15.5-alpine

# Environment variables are set via docker-compose.yml from .env file

# Copy initial SQL files to the designated path
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL default port
EXPOSE 5432

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD pg_isready -U ${POSTGRES_USER:-admin} -d ${POSTGRES_DB:-blog} || exit 1