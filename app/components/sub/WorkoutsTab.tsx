'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout } from "@/lib/types";
import WorkoutCard from "./WorkoutCard";
import { Filter, Search, Loader2 } from "lucide-react";

interface WorkoutsTabProps {
  bookmarkedWorkouts: number[];
  toggleBookmark: (id: number) => void;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalWorkouts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

const WorkoutsTab = ({ bookmarkedWorkouts, toggleBookmark }: WorkoutsTabProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [minRating, setMinRating] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      
      if (selectedDifficulty) {
        params.append('difficulty', selectedDifficulty);
      }
      
      if (selectedInstructor) {
        params.append('instructor', selectedInstructor);
      }
      
      if (minRating) {
        params.append('minRating', minRating.toString());
      }
      
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/workouts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }

      const data = await response.json();
      setWorkouts(data.workouts || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedDifficulty, selectedInstructor, minRating, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategory, selectedDifficulty, selectedInstructor, minRating, debouncedSearch]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('');
    setSelectedInstructor('');
    setMinRating(undefined);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
          />
        </div>
        
        {/* Advanced Filters */}
        <div className="flex gap-2">
          <select 
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          
          <button 
            onClick={handleClearFilters}
            className="flex items-center px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:border-red-500 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {['All', 'HIIT', 'Strength', 'Cardio', 'Yoga', 'Core'].map((category) => (
          <button 
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === category 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-800 hover:bg-red-500'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-400">Sort by:</span>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none text-sm"
        >
          <option value="createdAt">Date Added</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
          <option value="difficulty">Difficulty</option>
        </select>
        
        <button
          onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-red-500 transition-colors text-sm"
        >
          {sortOrder === 'ASC' ? '↑' : '↓'}
        </button>
      </div>

      {/* Results Info */}
      {pagination && (
        <div className="text-sm text-gray-400">
          Showing {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalWorkouts)} of {pagination.totalWorkouts} workouts
        </div>
      )}

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
            onClick={fetchWorkouts}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && workouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No workouts found</p>
          <button 
            onClick={handleClearFilters}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Workout Grid */}
      {!loading && !error && workouts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.prevPage!)}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-500 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    page === pagination.currentPage
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 border border-gray-700 hover:border-red-500'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.nextPage!)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-500 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutsTab;