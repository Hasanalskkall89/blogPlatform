# Blog Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A comprehensive blog platform built with Next.js for frontend and Node.js for backend, featuring a modern admin dashboard and robust content management system.

![Platform Preview](https://img.shields.io/badge/Platform-Full--Stack-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)

## ✨ Key Features

![Responsive](https://img.shields.io/badge/Responsive-Design-blue?style=flat-square&logo=css3)
![Dark Mode](https://img.shields.io/badge/Dark%2FLight-Mode-purple?style=flat-square)
![SEO](https://img.shields.io/badge/SEO-Optimized-green?style=flat-square)
![Authentication](https://img.shields.io/badge/Authentication-JWT-orange?style=flat-square)
![Upload](https://img.shields.io/badge/File-Uploads-yellow?style=flat-square)
![Analytics](https://img.shields.io/badge/Analytics-Enabled-blue?style=flat-square)

### 🎨 Frontend
- Modern and responsive user interface
- Dark/Light mode support
- Advanced content search
- Video and image support
- Category-based navigation
- SEO optimized

### 🛠️ Admin Dashboard
- Comprehensive content management
- Media library (images and videos)
- Category management
- Analytics and statistics
- User management
- Secure authentication

### ⚙️ Backend
- RESTful API
- JWT authentication
- File upload handling
- Database management
- Caching system
- Security features

## 🛡️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=next.js) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css) |
| **Admin Dashboard** | ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TipTap](https://img.shields.io/badge/TipTap-Editor-purple) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js) ![Express](https://img.shields.io/badge/Express-4-black?logo=express) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql) |
| **Authentication** | ![JWT](https://img.shields.io/badge/JWT-Secure-black?logo=json-web-tokens) ![bcrypt](https://img.shields.io/badge/bcrypt-Encryption-green) |
| **Storage** | ![Local](https://img.shields.io/badge/Local-Filesystem-blue) |
| **Deployment** | ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker) ![Nginx](https://img.shields.io/badge/Nginx-Proxy-009639?logo=nginx) |

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository.

---

<div align="center">

**Built with ❤️ by [Techlite](https://techlite.dev) using modern web technologies**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-💚-green?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Full%20Stack-🚀-blue?style=for-the-badge)

</div>
