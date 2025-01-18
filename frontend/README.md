# Blog For Gaza - Frontend

This is a modern news and sports blog platform built with [Next.js](https://nextjs.org), focusing on delivering content about Gaza and related topics.

## Features

- Modern and responsive design
- News articles and sports coverage
- Video content support
- Category-based content organization
- Multi-language support (English/Arabic)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd BlogForGaza/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
- Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
- Update the following variables in `.env.local`:
  - `NEXT_PUBLIC_API_URL`: Your API base URL
  - `NEXT_PUBLIC_MEDIA_URL`: Your media server URL
  - `NEXT_PUBLIC_CONTACT_EMAIL`: Contact email address
  - `NEXT_PUBLIC_SUPPORT_EMAIL`: Support email address

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/           # Next.js app directory
├── components/    # Reusable React components
├── public/        # Static files
└── styles/        # Global styles and CSS modules
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and React