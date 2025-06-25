'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flame, 
  Target, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Loader2,
  Filter,
  Search
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Activity {
  id: number;
  activityName: string;
  description?: string;
  duration: number;
  caloriesBurned: number;
  category: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

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

const ActivityTab = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    activityName: '',
    description: '',
    duration: '',
    caloriesBurned: '',
    category: 'Other',
    difficulty: 'Moderate' as 'Easy' | 'Moderate' | 'Hard',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'HIIT', 'Core', 'Other'];

  // Fetch activities and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [activitiesResponse, statsResponse] = await Promise.all([
        fetch('/api/activities'),
        fetch('/api/activities/stats')
      ]);

      if (activitiesResponse.ok && statsResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        const statsData = await statsResponse.json();
        
        setActivities(activitiesData.activities || []);
        setStats(statsData);
      } else {
        // Check for authentication errors
        if (activitiesResponse.status === 401 || statsResponse.status === 401) {
          console.error('Authentication required');
          signOut();
          router.push('/auth');
          return;
        }
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingActivity(null);
        resetForm();
        fetchData(); // Refresh data
      } else if (response.status === 401) {
        // Handle authentication error
        console.error('Authentication required');
        signOut();
        router.push('/auth');
        return;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save activity');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      activityName: '',
      description: '',
      duration: '',
      caloriesBurned: '',
      category: 'Other',
      difficulty: 'Moderate',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Edit activity
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      activityName: activity.activityName,
      description: activity.description || '',
      duration: activity.duration.toString(),
      caloriesBurned: activity.caloriesBurned.toString(),
      category: activity.category,
      difficulty: activity.difficulty,
      notes: activity.notes || '',
      date: activity.date
    });
    setShowForm(true);
  };

  // Delete activity
  const handleDelete = async (activityId: number) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        throw new Error('Failed to delete activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
    }
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
    const matchesSearch = activity.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.description && activity.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Moderate': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-500 mb-1">{stats.totalActivities}</div>
            <div className="text-gray-400 text-sm">Total Activities</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-500 mb-1">{formatDuration(stats.totalDuration)}</div>
            <div className="text-gray-400 text-sm">Total Time</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500 mb-1">{stats.totalCalories.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Calories Burned</div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500 mb-1">{stats.currentStreak}</div>
            <div className="text-gray-400 text-sm">Day Streak</div>
          </div>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Activities</h2>
          <p className="text-gray-400">Track your fitness journey</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingActivity(null);
            resetForm();
          }}
          className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Activity
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
          />
        </div>
        
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">
              {editingActivity ? 'Edit Activity' : 'Log New Activity'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Activity Name *</label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={(e) => setFormData({...formData, activityName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (min) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Calories *</label>
                  <input
                    type="number"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  >
                    {categories.filter(cat => cat !== 'All').map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as 'Easy' | 'Moderate' | 'Hard'})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
                >
                  {editingActivity ? 'Update' : 'Save'} Activity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingActivity(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
            onClick={fetchData}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Activities List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No activities found</p>
              <button 
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Log Your First Activity
              </button>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{activity.activityName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(activity.difficulty)} bg-gray-700`}>
                        {activity.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/20">
                        {activity.category}
                      </span>
                    </div>
                    
                    {activity.description && (
                      <p className="text-gray-400 mb-3">{activity.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(activity.duration)}
                      </div>
                      <div className="flex items-center">
                        <Flame className="w-4 h-4 mr-1" />
                        {activity.caloriesBurned} cal
                      </div>
                    </div>
                    
                    {activity.notes && (
                      <p className="text-gray-500 text-sm mt-3 italic">"{activity.notes}"</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityTab; 