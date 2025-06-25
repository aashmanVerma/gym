'use client';

import { useState, useEffect } from 'react';
import { Bookmark, ChevronRight, Loader2 } from "lucide-react";
import WorkoutCard from "./WorkoutCard";
import { Workout } from "@/lib/types";

const BookmarksTab = ({ 
  bookmarkedWorkouts,
  toggleBookmark,
  setActiveTab 
}: {
  bookmarkedWorkouts: number[],
  toggleBookmark: (id: number) => void,
  setActiveTab: (tab: string) => void
}) => {
  const [bookmarkedWorkoutsData, setBookmarkedWorkoutsData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarked workouts data
  const fetchBookmarkedWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bookmarks');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      
      const data = await response.json();
      
      // Extract workout data from bookmarks, filtering out null workouts
      const workouts = data.bookmarks
        ?.filter((bookmark: any) => bookmark.workout !== null)
        ?.map((bookmark: any) => bookmark.workout) || [];
      setBookmarkedWorkoutsData(workouts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedWorkouts();
  }, []);

  // Refresh bookmarks when bookmarkedWorkouts changes
  useEffect(() => {
    if (bookmarkedWorkouts.length !== bookmarkedWorkoutsData.length) {
      fetchBookmarkedWorkouts();
    }
  }, [bookmarkedWorkouts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Saved Workouts</h2>
        <span className="text-gray-400">{bookmarkedWorkoutsData.length} workout{bookmarkedWorkoutsData.length !== 1 ? 's' : ''} saved</span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={fetchBookmarkedWorkouts}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Bookmarked Workouts */}
      {!loading && !error && bookmarkedWorkoutsData.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedWorkoutsData.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              showBookmark={true}
              bookmarkedWorkouts={bookmarkedWorkouts}
              toggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookmarkedWorkoutsData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No saved workouts yet</h3>
          <p className="text-gray-400 mb-6">Start bookmarking workouts to build your personal collection</p>
          <button 
            onClick={() => setActiveTab('workouts')}
            className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center mx-auto"
          >
            Browse Workouts
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookmarksTab