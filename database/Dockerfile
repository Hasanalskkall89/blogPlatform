# Use a specific version of PostgreSQL for better stability
FROM postgres:15.5-alpine

# Environment variables will be overridden by docker-compose or run command
ENV POSTGRES_DB=blog
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy SSL certificates
COPY ./config/ssl/server.crt /var/lib/postgresql/server.crt
COPY ./config/ssl/server.key /var/lib/postgresql/server.key

# Set proper permissions for SSL files
RUN chmod 600 /var/lib/postgresql/server.key && \
    chown postgres:postgres /var/lib/postgresql/server.crt /var/lib/postgresql/server.key

# Update PostgreSQL configuration to use SSL
RUN echo "ssl = on" >> /usr/local/share/postgresql/postgresql.conf && \
    echo "ssl_cert_file = '/var/lib/postgresql/server.crt'" >> /usr/local/share/postgresql/postgresql.conf && \
    echo "ssl_key_file = '/var/lib/postgresql/server.key'" >> /usr/local/share/postgresql/postgresql.conf

# Copy initial SQL files to the designated path
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL default port
EXPOSE 5432

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1