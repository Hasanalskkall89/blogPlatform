# Blog Backend API

This is the backend API for the Blog application, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── db.js          # Database connection
│   └── index.js       # Application entry point
├── scripts/           # Utility scripts
├── uploads/          # Media storage directory
└── .env.example      # Environment variables template
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create uploads directory**
   ```bash
   mkdir -p uploads/images uploads/videos/standalone uploads/videos/posts
   ```
   This directory structure is required for storing uploaded media files:
   - `uploads/images`: For blog post images
   - `uploads/videos/standalone`: For standalone videos
   - `uploads/videos/posts`: For videos attached to posts

4. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables with your configuration
   ```bash
   cp .env.example .env
   ```

5. **Database Setup**
   - Create a PostgreSQL database
   - Update database credentials in `.env`
   - Run database migrations (if applicable)

## Development Scripts

- `npm start`: Start the server
- `npm run dev`: Start the server in development mode with hot reload
- `scripts/generate-sample-images.js`: Utility script to generate sample images for testing purposes. This script is useful during development to:
  - Test media upload functionality
  - Populate the blog with sample content
  - Verify storage directory structure
  - Test different image formats and sizes

## API Documentation

### Authentication
- POST `/api/auth/login`: Admin login
- POST `/api/auth/refresh`: Refresh access token

### Posts
- GET `/api/posts`: Get all posts
- POST `/api/posts`: Create new post (requires auth)
- PUT `/api/posts/:id`: Update post (requires auth)
- DELETE `/api/posts/:id`: Delete post (requires auth)

### Media
- POST `/api/media/upload`: Upload media file (requires auth)
- GET `/api/media/list/:type`: List media files by type (requires auth)
- DELETE `/api/media/:filename`: Delete media file (requires auth)

### Categories
- GET `/api/categories`: Get all categories
- POST `/api/categories`: Create category (requires auth)
- PUT `/api/categories/:id`: Update category (requires auth)
- DELETE `/api/categories/:id`: Delete category (requires auth)

## Docker Setup

### Prerequisites
- Docker

### Using Docker

1. **Build the Docker image**
   ```bash
   docker build -t blog-backend .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name blog-backend \
     -p 5000:5000 \
     -v $(pwd)/uploads:/app/uploads \
     --network blog-network \
     --env-file .env \
     blog-backend
   ```

### Docker Notes

1. **Container Setup**
   - Uses Node.js 18 Alpine as base image
   - Installs all dependencies using `npm install`
   - Creates basic uploads directory automatically
   - Exposes port 5000 for API access

2. **Environment Variables**
   - All environment variables should be set in `.env` file
   - Make sure database connection details are correctly configured
   - The container reads environment variables from the host

3. **File Storage**
   - The uploads directory is mounted from the host system
   - Ensures media files persist between container restarts
   - Host path: `./uploads`
   - Container path: `/app/uploads`

4. **Networking**
   - Container exposes port 5000
   - Uses the shared network `blog-network` for database connectivity
   - Make sure to create the network if it doesn't exist:
     ```bash
     docker network create blog-network
     ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify database credentials match in both `.env` and database setup:
     ```env
     DB_USER=admin
     DB_PASSWORD=BlogAdmin@2024!
     DB_HOST=database
     DB_PORT=5432
     ```
   - Check if database service is running:
     ```bash
     # Using Docker
     docker ps | grep blog-db
     
     # Direct PostgreSQL
     pg_isready -h localhost -p 5432
     ```
   - Verify network connectivity:
     ```bash
     # Test connection
     nc -zv database 5432
     
     # Check if Docker network exists
     docker network ls | grep blog-network
     ```

2. **File Upload Issues**
   - Verify upload directory exists and has correct permissions:
     ```bash
     # Create uploads directory if missing
     mkdir -p uploads/images uploads/videos/standalone uploads/videos/posts
     
     # Set correct permissions
     chmod -R 755 uploads
     ```
   - Check `REQUEST_SIZE_LIMIT` in `.env` matches your needs
   - Verify disk space availability

3. **Authentication Issues**
   - Ensure `JWT_SECRET` is properly set in `.env`
   - Verify admin credentials match in both `.env` and database:
     ```env
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=BlogAdmin@2024!
     ```
   - Check token expiration settings:
     ```env
     JWT_EXPIRATION=24h
     ```

4. **CORS Issues**
   - Verify CORS settings match your frontend domains:
     ```env
     CORS_ORIGINS=https://blog.example.com,https://admin.blog.example.com
     ```
   - Check browser console for CORS errors
   - Ensure protocol (http/https) matches

5. **Performance Issues**
   - Check database connection pool settings:
     ```env
     DB_MAX_CONNECTIONS=20
     DB_IDLE_TIMEOUT=30000
     DB_CONNECTION_TIMEOUT=2000
     ```
   - Monitor server resources (CPU, memory, disk)
   - Review application logs for bottlenecks

### Checking Logs

```bash
# View application logs
docker logs blog-backend

# View database logs
docker logs blog-db

# Follow logs in real-time
docker logs -f blog-backend
```

### Quick Fixes

1. **Reset Application**
   ```bash
   # Stop containers
   docker-compose down
   
   # Clear volumes if needed
   docker-compose down -v
   
   # Rebuild and start
   docker-compose up --build -d
   ```

2. **Refresh Database Connection**
   ```bash
   # Restart backend container
   docker restart blog-backend
   
   # Or restart all services
   docker-compose restart
   ```

3. **Clear Upload Directory**
   ```bash
   # Remove temporary files
   rm -rf uploads/temp/*
   
   # Reset permissions
   chmod -R 755 uploads
   ```

For additional support or persistent issues:
1. Check the application logs for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure all required services (database, storage) are accessible
4. Compare configurations with the example files in the repository

## Important Notes

1. **Uploads Directory**
   - The `uploads` directory must be created manually after cloning
   - This directory is ignored by git to avoid storing large binary files
   - Make sure the directory has proper write permissions

2. **Sample Data Script**
   - The `scripts/generate-sample-images.js` script is provided for development purposes
   - It helps in testing the media upload functionality without manual file uploads
   - Should not be used in production environment

3. **Security**
   - All sensitive information should be stored in `.env` file
   - The `.env` file should never be committed to version control
   - Admin authentication is required for all write operations

## License

[MIT License](LICENSE)
