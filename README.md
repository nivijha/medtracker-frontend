# MedTracker Frontend

A modern, user-friendly medical records management system built with Next.js. MedTracker helps users manage their health information, medical reports, appointments, and personal health data in one secure location.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Dashboard

- **Health Overview**: Quick stats for appointments, reports, medications, and check-ups
- **Recent Activity Feed**: Track your latest medical activities
- **Quick Actions**: Fast access to frequently used features
- **Health Insights**: Personalized health recommendations
- **Real-time Notifications**: Stay updated with important alerts

### Medical Reports

- **Advanced Search**: Find reports quickly by name or content
- **Smart Filters**: Filter by status, category, and date range
- **Card-based Layout**: Clean, modern report display
- **Status Tracking**: Monitor report status (completed, pending, reviewed)
- **Download & View**: Easy access to your medical documents

### Profile Management

- **Editable Profile**: Update personal information easily
- **Health Stats**: View your health metrics at a glance
- **Achievement System**: Track your health milestones
- **Recent Activity**: See your latest health-related actions
- **Emergency Contact**: Store important contact information

### Settings

- **Security**: Password management and two-factor authentication
- **Notifications**: Customize email, SMS, and push notifications
- **Appearance**: Theme selection (Light/Dark/Auto) and font size
- **Privacy**: Control data sharing and profile visibility
- **Language**: English

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/medtracker-frontend.git
   cd medtracker-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_NAME=MedTracker
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
medtracker-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   ├── reports/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── LoggedInNavbar.jsx
│   │   └── [other components]
│   ├── lib/
│   │   └── utils.js
│   └── styles/
│       └── globals.css
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
```

## Built With

- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[React 18](https://react.dev/)** - JavaScript library for building user interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - Programming language

## Responsive Design

MedTracker is fully responsive and works seamlessly across:

- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## UI/UX Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Intuitive Navigation**: Easy-to-use navbar with active route highlighting
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Dark Mode Ready**: Theme switching capabilities

## Authentication

- Secure login and registration
- JWT token-based authentication
- Protected routes with middleware
- Automatic session management
- Secure logout functionality

## API Integration

The frontend connects to a backend API for:

- User authentication
- Medical reports management
- Profile data
- Settings synchronization

## Upcoming Features

- [ ] Appointment scheduling
- [ ] Medication reminders
- [ ] Health data visualization (charts/graphs)
- [ ] PDF report generation
- [ ] Real-time notifications
- [ ] Doctor-patient messaging
- [ ] Health record sharing

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Design inspiration from modern health platforms
- Icon set by Lucide
- Community feedback and contributions

## Links

- [Live Demo](https://medtracker-frontend.vercel.app)
- [Backend Repository](https://github.com/nivijha/medtracker-backend)
