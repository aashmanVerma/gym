import { Workout } from "@/lib/types";
import { Bookmark, BookmarkCheck, Clock, Flame, Play, Star } from "lucide-react";

const WorkoutCard = ({ 
  workout, 
  showBookmark = true, 
  bookmarkedWorkouts, 
  toggleBookmark 
}: {
  workout: Workout,
  showBookmark: boolean,
  bookmarkedWorkouts: number[],
  toggleBookmark: (id: number) => void
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-500';
      case 'Intermediate': return 'text-yellow-500';
      case 'Advanced': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative">
        <img 
          src={workout.thumbnail} 
          alt={workout.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {showBookmark && (
            <button 
              onClick={() => toggleBookmark(workout.id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                bookmarkedWorkouts.includes(workout.id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-black/50 text-white hover:bg-red-500'
              }`}
            >
              {bookmarkedWorkouts.includes(workout.id) ? 
                <BookmarkCheck className="w-4 h-4" /> : 
                <Bookmark className="w-4 h-4" />
              }
            </button>
          )}
          <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-all">
            <Play className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(workout.difficulty)} bg-black/50 backdrop-blur-sm`}>
            {workout.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-red-500 font-semibold">{workout.category}</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="text-sm text-gray-400">{workout.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{workout.title}</h3>
        <p className="text-gray-400 text-sm mb-4">with {workout.instructor}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {workout.duration}
          </div>
          <div className="flex items-center">
            <Flame className="w-4 h-4 mr-1" />
            {workout.calories} cal
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {workout.tags.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard