# Blog Platform

A comprehensive blog platform built with Next.js for frontend and Node.js for backend, featuring a modern admin dashboard and robust content management system.

## Key Features

### Frontend
- Modern and responsive user interface
- Dark/Light mode support
- Advanced content search
- Video and image support
- Category-based navigation
- SEO optimized

### Admin Dashboard
- Comprehensive content management
- Media library (images and videos)
- Category management
- Analytics and statistics
- User management
- Secure authentication

### Backend
- RESTful API
- JWT authentication
- File upload handling
- Database management
- Caching system
- Security features

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Admin Dashboard**: Next.js, React
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Storage**: Local file system
- **Deployment**: Docker

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker and Docker Compose
- SSL certificate (for production)

## Getting Started

### Development Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd blog-platform
```

2. Install dependencies:
```bash
# Frontend dependencies
cd frontend
npm install

# Admin dashboard dependencies
cd ../admin-dashboard
npm install

# Backend dependencies
cd ../backend
npm install
```

3. Environment Setup:
- Copy `.env.example` to `.env`
- Update the environment variables according to your setup

4. Start development servers:
```bash
# Frontend (http://localhost:3000)
cd frontend
npm run dev

# Admin Dashboard (http://localhost:3001)
cd admin-dashboard
npm run dev

# Backend (http://localhost:5000)
cd backend
npm run dev
```

### Docker Deployment

1. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the variables for your production environment

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

## Project Structure

```
blog-platform/
├── frontend/           # Main website
├── admin-dashboard/    # Admin interface
├── backend/           # API server
├── nginx/            # Nginx configuration
├── database/         # Database migrations and seeds
└── docker-compose.yml
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_DB` | Database name | Yes |
| `POSTGRES_USER` | Database user | Yes |
| `POSTGRES_PASSWORD` | Database password | Yes |
| `DOMAIN` | Main domain name | Yes |
| `ADMIN_DOMAIN` | Admin dashboard domain | Yes |
| `SSL_EMAIL` | Email for SSL certificates | Yes |
| `JWT_SECRET` | JWT encryption key | Yes |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js, React, Node.js, Express, PostgreSQL, TailwindCSS, Docker, and Nginx
