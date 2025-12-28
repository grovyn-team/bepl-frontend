# BEPL - Babu Erectors Pvt. Ltd. Website

A modern, responsive website for Babu Erectors Pvt. Ltd., a leading construction and engineering company specializing in structural steel erection, equipment installation, and heavy engineering services.

## 🚀 Features

### Public Website
- **Homepage**: Hero section with 3D animations, company stats, services preview, and project highlights
- **About**: Company history, mission, vision, values, and team statistics
- **Services**: Comprehensive list of construction and engineering services with detailed descriptions
- **Projects**: Portfolio showcasing completed projects across various industries
- **Contact**: Contact form with email integration
- **Careers**: Job listings with resume upload functionality

### Admin Panel
- **Dashboard**: Overview of contacts, career applications, and content management
- **Content Management**: CRUD operations for Services, Projects, About content
- **Contact Management**: View and manage contact form submissions
- **Career Management**: Review and manage job applications
- **Image Upload**: Cloudinary integration for image management

### Technical Features
- 🎨 Modern UI with shadcn/ui components
- 🎭 Smooth animations using Framer Motion
- 🎯 3D visualizations with React Three Fiber
- 📱 Fully responsive design
- 🌙 Theme support (light/dark mode)
- 🔐 Protected admin routes with authentication
- 📊 Real-time data fetching with TanStack Query
- 🖼️ Cloudinary integration for image storage

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### 3D Graphics
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### Data Management
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Other Libraries
- **date-fns** - Date utility functions
- **recharts** - Chart library
- **sonner** - Toast notifications
- **react-pdf** - PDF rendering

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **bun** (package manager)
- **Backend API** running (see backend setup)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bepl
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   For production, update `VITE_API_URL` to your production API URL.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   The application will be available at `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
bepl/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── pdf.worker.min.mjs
├── src/
│   ├── assets/            # Image assets
│   ├── components/         # React components
│   │   ├── 3d/           # 3D components
│   │   ├── admin/        # Admin components
│   │   ├── animations/   # Animation components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API
│   ├── pages/            # Page components
│   │   ├── admin/       # Admin pages
│   │   └── ...          # Public pages
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🔌 API Integration

The application connects to a backend API. Ensure your backend is running and accessible at the URL specified in `VITE_API_URL`.

### API Endpoints Used

- **Services**: `GET /api/services`, `POST /api/services`, `PUT /api/services/:id`, `DELETE /api/services/:id`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
- **About**: `GET /api/about`, `PUT /api/about`
- **Contact**: `POST /api/contact`, `GET /api/contact`
- **Careers**: `POST /api/careers`, `GET /api/careers`
- **Auth**: `POST /api/auth/login`, `GET /api/auth/me`

See `src/lib/api.ts` for the complete API client implementation.

## 🖼️ Image Management

The project uses **Cloudinary** for image storage and management. See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed setup instructions.

## 📧 Email Configuration

For contact form and email functionality, see [EMAIL_TROUBLESHOOTING.md](./EMAIL_TROUBLESHOOTING.md) for setup and troubleshooting.

## 🔐 Admin Access

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. Access the admin dashboard at `/admin/dashboard`

Admin routes are protected and require authentication.

## 🎨 Customization

### Theme
The project supports light/dark themes. Theme configuration can be found in:
- `src/hooks/useTheme.ts`
- `tailwind.config.ts`

### Colors & Styling
- Edit `tailwind.config.ts` for theme colors
- Global styles in `src/index.css`
- Component styles use Tailwind utility classes

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Header.tsx`

## 🚀 Building for Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   The `dist/` folder contains the production-ready files. Deploy this folder to your hosting service (Vercel, Netlify, etc.).

## 🧪 Development Tips

- Use the `@/` alias for imports from the `src/` directory
- Components follow the shadcn/ui patterns
- API calls are centralized in `src/lib/api.ts`
- Animations use Framer Motion - check `src/components/animations/` for reusable animation components

## 📝 License

This project is proprietary software for Babu Erectors Pvt. Ltd.

## 👥 Contributing

This is a private project. For contributions or issues, please contact the development team.

## 📞 Support

For technical support or questions:
- Check the documentation files in the root directory
- Review the code comments in `src/lib/api.ts` for API usage
- Contact the development team

---

**Built with ❤️ for Babu Erectors Pvt. Ltd.**

