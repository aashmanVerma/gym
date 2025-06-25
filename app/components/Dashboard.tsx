"use client"

import { UserProfile, Workout } from "@/lib/types";
import { Bell, Bookmark, Dumbbell, LogOut, Settings, User, Zap, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileTab from "./sub/ProfileTab";
import WorkoutsTab from "./sub/WorkoutsTab";
import BookmarksTab from "./sub/BookmarksTab";
import ActivityTab from "./sub/ActivityTab";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [bookmarkedWorkouts, setBookmarkedWorkouts] = useState<number[]>([]);
  const [workoutLibrary, setWorkoutLibrary] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    data: session
  } = useSession()
  const router = useRouter()

  const user: UserProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    memberSince: "January 2024",
    currentStreak: 12,
    totalWorkouts: 84,
    favoriteWorkout: "HIIT Blast",
    fitnessLevel: "Intermediate",
    goals: ["Weight Loss", "Muscle Gain", "Endurance"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  // Fetch user's bookmarked workouts
  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (response.ok) {
        const data = await response.json();
        // Extract workout IDs from bookmarks, filtering out null workouts
        const workoutIds = data.bookmarks
          ?.filter((bookmark: any) => bookmark.workout !== null)
          ?.map((bookmark: any) => bookmark.workoutId) || [];
        setBookmarkedWorkouts(workoutIds);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle bookmark using API
  const toggleBookmark = async (workoutId: number) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workoutId }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state based on API response
        if (result.success) {
          if (result.action === 'added') {
            setBookmarkedWorkouts(prev => [...prev, workoutId]);
          } else if (result.action === 'removed') {
            setBookmarkedWorkouts(prev => prev.filter(id => id !== workoutId));
          }
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  // Load bookmarks on component mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                SweatLab
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => {
                signOut()
                router.push('/')
              }} className="p-2 text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{session?.user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400">Ready to crush your fitness goals today?</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'workouts', label: 'Workout Library', icon: Dumbbell },
            { id: 'activities', label: 'My Activities', icon: Activity },
            { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'workouts' && (
          <WorkoutsTab 
            bookmarkedWorkouts={bookmarkedWorkouts}
            toggleBookmark={toggleBookmark}
          />
        )}
        {activeTab === 'activities' && <ActivityTab />}
        {activeTab === 'bookmarks' && (
          <BookmarksTab 
            bookmarkedWorkouts={bookmarkedWorkouts}
            toggleBookmark={toggleBookmark}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;