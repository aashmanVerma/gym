# 🏋️‍♂️ SweatLab - Fitness Tracking Application

A modern, full-stack fitness tracking application built with Next.js, TypeScript, and PostgreSQL. Track your workouts, log activities, and monitor your fitness progress with a beautiful, responsive interface.

![SweatLab Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure login/signup with better-auth
- **Workout Library** - Browse and search through workout collections
- **Activity Tracking** - Log your daily workouts and activities
- **Bookmark System** - Save your favorite workouts for quick access
- **Progress Monitoring** - Track calories, duration, and streaks
- **Responsive Design** - Works seamlessly on desktop and mobile

### 📊 Dashboard Features
- **Profile Tab** - View your fitness statistics and recent activities
- **Workout Library** - Browse workouts with advanced filtering and search
- **My Activities** - Log and manage your workout activities
- **Bookmarks** - Access your saved workouts

### 🔧 Technical Features
- **Real-time Statistics** - Dynamic calculation of fitness metrics
- **Advanced Filtering** - Filter by category, difficulty, instructor
- **Pagination** - Efficient data loading for large datasets
- **Search Functionality** - Find workouts and activities quickly
- **Data Persistence** - PostgreSQL database with Sequelize ORM

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Better Auth** - Authentication solution

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Sequelize ORM** - Database management
- **PostgreSQL** - Reliable database
- **Better Auth** - User authentication and session management

### Database Models
- **User** - User profiles and authentication
- **Workout** - Workout library with metadata
- **UserActivity** - Personal workout logs
- **Bookmark** - User's saved workouts

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/aashmanVerma/gym.git
   cd gym
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Better Auth Configuration
   BETTER_AUTH_SECRET=your_better_auth_secret_here
   BETTER_AUTH_URL=http://localhost:3000

   # Database Configuration
   DATABASE_URL=your_postgresql_connection_string

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   SENDER=your_email@gmail.com

   # Exercise API Configuration (optional)
   API_KEY=your_exercise_api_key_here
   API_HOST=https://api.exercisedb.io
   ```

4. **Database Setup**
   ```sql
   -- Create UserActivity Table
   CREATE TABLE IF NOT EXISTS "userActivity" (
       id SERIAL PRIMARY KEY,
       "userId" TEXT NOT NULL,
       "activityName" VARCHAR(255) NOT NULL,
       description TEXT,
       duration INTEGER NOT NULL,
       "caloriesBurned" INTEGER NOT NULL,
       category VARCHAR(255) NOT NULL DEFAULT 'Other',
       difficulty VARCHAR(50) CHECK (difficulty IN ('Easy', 'Moderate', 'Hard')) NOT NULL DEFAULT 'Moderate',
       notes TEXT,
       date DATE NOT NULL DEFAULT CURRENT_DATE,
       "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
       "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX IF NOT EXISTS "userActivity_userId_idx" ON "userActivity" ("userId");
   CREATE INDEX IF NOT EXISTS "userActivity_date_idx" ON "userActivity" (date);
   CREATE INDEX IF NOT EXISTS "userActivity_category_idx" ON "userActivity" (category);
   CREATE INDEX IF NOT EXISTS "userActivity_userId_date_idx" ON "userActivity" ("userId", date);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
sweatlab/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── activities/    # Activity management
│   │   ├── bookmarks/     # Bookmark operations
│   │   └── workouts/      # Workout data
│   ├── auth/              # Authentication pages
│   ├── components/        # React components
│   │   └── sub/          # Sub-components
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Shared UI components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # Database models
├── operations/           # Business logic operations
└── public/              # Static assets
```

## 🔌 API Endpoints

### Activities
- `GET /api/activities` - Fetch user activities
- `POST /api/activities` - Create new activity
- `GET /api/activities/stats` - Get user statistics

### Bookmarks
- `GET /api/bookmarks` - Fetch user bookmarks
- `POST /api/bookmarks` - Toggle bookmark
- `GET /api/bookmarks/check` - Check bookmark status

### Workouts
- `GET /api/workouts` - Fetch workout library

## 🎨 Features in Detail

### Activity Tracking
- Log workouts with detailed information
- Track duration, calories, and difficulty
- Add notes and descriptions
- Categorize activities (Cardio, Strength, Yoga, etc.)
- View activity history and statistics

### Workout Library
- Browse curated workout collection
- Advanced filtering by category, difficulty, instructor
- Search functionality
- Bookmark favorite workouts
- Responsive grid layout

### Progress Monitoring
- Real-time statistics calculation
- Current streak tracking
- Total calories burned
- Total workout time
- Category breakdown

### User Experience
- Modern, responsive design
- Dark theme with gradient accents
- Smooth animations and transitions
- Intuitive navigation
- Mobile-friendly interface

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **Heroku** - Traditional hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Better Auth** - Authentication solution
- **Lucide React** - Beautiful icons
- **Tailwind CSS** - Utility-first CSS framework
- **Next.js** - React framework
- **Sequelize** - Database ORM

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---


*Transform your fitness journey with data-driven insights and beautiful tracking.*
