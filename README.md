# Carbitrages Frontend

Revolutionary car buying platform frontend built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Stack**: Next.js 15 with TypeScript and Tailwind CSS
- **Authentication**: Complete user registration and login system
- **State Management**: Redux Toolkit with persistence
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Form Validation**: Zod schemas with React Hook Form
- **Icons**: Lucide React icons for modern interface

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: Redux Toolkit + Redux Persist
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

## 🏃‍♂️ Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── ui/             # Base UI components
├── lib/                # Utility functions
├── providers/          # React context providers
├── services/           # API service functions
└── store/              # Redux store and slices
```

## 🔐 Authentication Flow

- User registration with role selection (buyer/dealer)
- Secure login with JWT tokens
- Password strength validation
- Token refresh mechanism
- Protected routes

## 🎨 UI Components

Built with custom Tailwind CSS components:
- Buttons with variants
- Form inputs with validation states
- Cards and layouts
- Responsive navigation

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system with Tailwind CSS
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔗 API Integration

- Axios HTTP client with interceptors
- Automatic token refresh
- Error handling and retry logic
- TypeScript API interfaces

## 🚀 Deployment

The app is ready for deployment on platforms like:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

## 📄 License

This project is part of the Carbitrages MVP.
