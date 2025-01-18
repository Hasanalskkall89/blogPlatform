# Database Setup

This directory contains all database-related configurations and setup files for the Blog platform.

## Directory Structure

- `Dockerfile`: PostgreSQL container configuration
- `init.sql`: Initial database schema and tables
- `database-config.json`: Database configuration and maintenance commands
- `.env.example`: Example environment variables

## Setup Options

### 1. Standalone Setup

1. Install PostgreSQL 15 or later
2. Create a new database:
   ```sql
   CREATE DATABASE blog;
   ```
3. Run the initialization script:
   ```bash
   psql -U your_user -d blog -f init.sql
   ```
4. Configure your connection settings in `.env` file

### 2. Docker Setup

1. Copy `.env.example` to `.env` and update values
2. Build the image:
   ```bash
   docker build -t blog-db .
   ```
3. Create required volumes:
   ```bash
   docker volume create blog-data
   docker volume create blog-backups
   ```
4. Run the container:
   ```bash
   docker run -d \
     --name blog-db \
     -p 5432:5432 \
     -v blog-data:/var/lib/postgresql/data \
     --env-file .env \
     blog-db
   ```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database Configuration
DB_NAME=blog                # Database name
DB_USER=postgres           # Database user
DB_PASSWORD=postgres       # Database password
DB_PORT=5432              # Database port

# SSL Configuration
SSL_CERT_PATH=./config/ssl/server.crt  # SSL certificate path
SSL_KEY_PATH=./config/ssl/server.key   # SSL private key path

# Backup Configuration
BACKUP_DIR=/backups       # Backup directory
BACKUP_RETENTION_DAYS=7   # Number of days to keep backups

# Docker Configuration
CONTAINER_NAME=blog-db    # Container name
DATA_VOLUME_NAME=blog-data # Volume for database files
BACKUP_VOLUME_NAME=blog-backups # Volume for backups
```

## SSL Certificates

SSL certificates are **required** when running PostgreSQL in Docker containers for several reasons:

1. **Security**: Ensures encrypted communication between services
2. **Docker Networking**: Many client applications require SSL when connecting to databases in containers
3. **Best Practices**: Follows security best practices even in development

See the [SSL Configuration](#ssl-configuration) section for setup instructions.

## Sample Data

The `samples` directory contains SQL files for populating the database with test data. These files are essential for:

1. **Development Testing**: Provides realistic data for testing features
2. **UI Development**: Enables frontend development without waiting for real data
3. **Demo Setup**: Quickly set up a demonstration environment

Sample files include:
- `sample_data.sql`: Basic blog posts and categories
- `sample_media.sql`: Sample media entries
- `sample_media_update.sql`: Additional media content
- `sample_videos.sql`: Sample standalone videos

To load sample data:
```bash
# Using psql directly
psql -U ${DB_USER} -d ${DB_NAME} -f samples/sample_data.sql
psql -U ${DB_USER} -d ${DB_NAME} -f samples/sample_media.sql
psql -U ${DB_USER} -d ${DB_NAME} -f samples/sample_videos.sql

# Using Docker
docker exec -i blog-db psql -U ${DB_USER} ${DB_NAME} < samples/sample_data.sql
```

## Backup and Restore

### Creating Backups
```bash
# Local backup
pg_dump -U ${DB_USER} ${DB_NAME} > ./backups/backup_$(date +%Y%m%d).sql

# Docker backup
docker exec blog-db pg_dump -U ${DB_USER} ${DB_NAME} > ./backups/backup_$(date +%Y%m%d).sql
```

### Restoring from Backup
```bash
# Local restore
psql -U ${DB_USER} -d ${DB_NAME} < ./backups/backup_file.sql

# Docker restore
docker exec -i blog-db psql -U ${DB_USER} ${DB_NAME} < ./backups/backup_file.sql
```

## Maintenance

Regular maintenance tasks are configured in `database-config.json`:
- Daily automatic backups
- Backup retention management
- Database optimization
- Health checks

For more details, refer to the maintenance section in `database-config.json`.

## Troubleshooting

### Common Issues

1. **Permission Issues**
   If you encounter permission issues with the default PostgreSQL user, create a new user:
   ```sql
   -- Connect as postgres user
   psql -U postgres
   
   -- Create new user with password
   CREATE USER blog_user WITH PASSWORD 'your_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE blog TO blog_user;
   
   -- If database already exists, grant schema privileges
   \c blog
   GRANT ALL ON ALL TABLES IN SCHEMA public TO blog_user;
   GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO blog_user;
   ```
   Then update your `.env` file with the new user credentials:
   ```env
   DB_USER=blog_user
   DB_PASSWORD=your_password
   ```

2. **Connection Issues**
   - Verify PostgreSQL is running: `pg_isready`
   - Check port availability: `netstat -an | findstr 5432`
   - Ensure host settings in `pg_hba.conf` allow your connections

3. **Docker Volume Permissions**
   If encountering volume permission issues:
   ```bash
   # Fix permissions on host
   sudo chown -R 999:999 $(docker volume inspect blog-data -f '{{ .Mountpoint }}')
   ```

For additional help or issues, check the PostgreSQL logs:
- Standalone: Check your PostgreSQL log directory
- Docker: `docker logs blog-db`
