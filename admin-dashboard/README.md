# Blog Admin Dashboard

A modern, feature-rich admin dashboard built with Next.js 14, designed to manage blog content efficiently and securely.

## 🌟 Features

### Content Management
- **Posts Management**
  - Create, edit, and delete blog posts
  - Rich text editor support
  - Draft and publish functionality
  - Category assignment
  - Media embedding

- **Media Library**
  - Upload and manage images and videos
  - Support for multiple file types
  - Organized media categorization
  - Easy media selection for posts

- **Category System**
  - Create and manage post categories
  - Track posts per category
  - Hierarchical category structure

### Video Management
- **Standalone Videos**
  - Upload and manage video content
  - Video metadata management
  - Custom video thumbnails
  - Video categorization

### Dashboard Analytics
- Real-time statistics
- Content performance metrics
- Recent activity tracking
- User engagement analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_MEDIA_URL=your_media_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The dashboard will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
admin-dashboard/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── dashboard/      # Dashboard routes
│   │   ├── login/         # Authentication
│   │   └── layout.js      # Root layout
│   ├── components/         # Reusable components
│   │   ├── PostForm/      # Post management
│   │   ├── MediaSelector/ # Media handling
│   │   └── ...
│   └── styles/            # Global styles
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## 🔒 Security Features

- JWT-based authentication
- Protected API routes
- Secure file upload handling
- Environment variable configuration
- Input sanitization
- XSS protection

## 💻 Technology Stack

- **Frontend Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Authentication**: JWT
- **Media Handling**: Custom media management system
- **UI Components**: Custom components with Tailwind

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_MEDIA_URL` | Media server URL | Yes |

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and React
