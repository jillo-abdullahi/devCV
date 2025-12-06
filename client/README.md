# DevCV Frontend

A modern, elegant resume builder application built with React, TypeScript, and Vite. Create professional resumes with multiple templates and export them as PDF documents.

## ✨ Features

- 📝 **Interactive Resume Builder**: Step-by-step form interface to create comprehensive resumes
- 🎨 **Multiple Templates**: Choose from minimalist, professional, and modern resume designs
- 📄 **PDF Generation**: Export your resume as a high-quality PDF document
- 💾 **State Management**: Powered by Zustand for seamless data persistence
- 🎯 **Type-Safe**: Built with TypeScript for robust development
- 🚀 **Fast Development**: Vite for lightning-fast HMR and builds
- 🛣️ **Type-Safe Routing**: TanStack Router with automatic route generation
- 🎨 **Beautiful UI**: Tailwind CSS 4 with custom components
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A running backend API server (default: `http://localhost:8080`)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jillo-abdullahi/devCV.git
cd devCV
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional):
```env
VITE_API_URL=http://localhost:8080
VITE_API_KEY=your_api_key_here
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   ├── PersonalInfoForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── EducationForm.tsx
│   │   ├── ProjectsForm.tsx
│   │   ├── SkillsForm.tsx
│   │   ├── SummaryForm.tsx
│   │   ├── ResumeBuilder.tsx
│   │   └── ResumePreview.tsx
│   ├── routes/            # TanStack Router routes
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── stores/            # Zustand state stores
│   │   └── resumeStore.ts
│   ├── types/             # TypeScript type definitions
│   │   └── resume.ts
│   ├── lib/              # Utility functions and API client
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── assets/           # Static assets
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── public/               # Public static files
├── components.json       # shadcn/ui configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### API Configuration

The application connects to a backend API for PDF generation. Configure the API endpoint in your `.env` file:

- `VITE_API_URL`: Backend API URL (default: `http://localhost:8080`)
- `VITE_API_KEY`: Optional API authentication key

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
import { Button } from '@/components/ui/button';
import type { ResumeData } from '@/types/resume';
```

## 📦 Available Resume Templates

1. **Minimalist**: Clean and simple design
2. **Professional**: Traditional corporate style
3. **Modern**: Contemporary and stylish layout

Templates are shared with the server in `../shared/templates/` to ensure the live preview matches the PDF output exactly.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UI components built with [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Routing powered by [TanStack Router](https://tanstack.com/router)

## 📞 Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/jillo-abdullahi/devCV/issues).
