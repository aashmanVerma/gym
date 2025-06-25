"use client"

import { Activity, UserProfile } from "@/lib/types";
import { Dumbbell, Flame, Target, TrendingUp, Trophy, Loader2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment"
import { createAuthClient } from "better-auth/react"
const { useSession } = createAuthClient()

interface UserStats {
  totalActivities: number;
  totalDuration: number;
  totalCalories: number;
  currentStreak: number;
  categoryStats: Array<{
    category: string;
    count: number;
    totalDuration: number;
    totalCalories: number;
  }>;
}

const ProfileTab = ({ user }: { user: UserProfile }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: session,
    isPending,
    error: sessionError,
    refetch
  } = useSession()

  // Fetch user stats and recent activities
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/activities/stats'),
        fetch('/api/activities?limit=3&sortBy=date&sortOrder=DESC')
      ]);

      if (statsResponse.ok && activitiesResponse.ok) {
        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();
        
        setStats(statsData);
        
        // Transform activities data to match Activity interface
        const transformedActivities = activitiesData.activities?.map((activity: any) => ({
          workout: activity.activityName,
          date: moment(activity.date).fromNow(),
          duration: `${activity.duration} min`,
          calories: activity.caloriesBurned.toString()
        })) || [];
        
        setRecentActivities(transformedActivities);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Error: {error}</p>
        <button 
          onClick={fetchUserData}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-red-500"
          /> */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold mb-2">{session?.user?.name || user.name}</h2>
            <p className="text-gray-400 mb-2">{session?.user?.email || user.email}</p>
            <p className="text-sm text-gray-500 mb-4">
              Member since {session?.user?.createdAt ? moment(session?.user?.createdAt).format("MMMM YYYY") : user.memberSince}
            </p>
            <div className="flex flex-wrap gap-2">
              {user.goals.map((goal, index) => (
                <span key={index} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  {goal}
                </span>
              ))}
            </div>
          </div>
          {/* <button className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all">
            Edit Profile
          </button> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-500 mb-1">
            {stats?.currentStreak || user.currentStreak}
          </div>
          <div className="text-gray-400 text-sm">Day Streak</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-500 mb-1">
            {stats?.totalActivities || user.totalWorkouts}
          </div>
          <div className="text-gray-400 text-sm">Total Activities</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {stats?.totalDuration ? formatDuration(stats.totalDuration) : '0m'}
          </div>
          <div className="text-gray-400 text-sm">Total Time</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-lg font-bold text-green-500 mb-1">
            {stats?.totalCalories ? `${stats.totalCalories.toLocaleString()}` : '0'} cal
          </div>
          <div className="text-gray-400 text-sm">Calories Burned</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-red-500" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div>
                  <h4 className="font-semibold">{activity.workout}</h4>
                  <p className="text-gray-400 text-sm">{activity.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{activity.duration}</div>
                  <div className="text-red-500 font-semibold">{activity.calories} cal</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No recent activities</p>
              <p className="text-sm text-gray-500">Start logging your workouts to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab