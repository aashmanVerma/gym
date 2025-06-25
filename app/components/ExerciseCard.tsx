import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Dumbbell, Users, Clock, BookMarkedIcon, BookMarked } from 'lucide-react';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  category: string;
  target: string;
  secondaryMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  gifUrl: string;
  description: string;
  instructions: string[];
}

const ExerciseCard = ({ exercise, bookmarked } : {
  exercise: Exercise,
  bookmarked: any
}) => {

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-80 relative">
        <BookMarked 
          className="absolute top-3 right-3 z-10 cursor-pointer w-5 h-5 text-gray-500 hover:text-blue-600 transition-colors" 
          onClick={() => bookmarked(exercise.id)} 
        />

        <Card className="overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={exercise.gifUrl} 
              alt={exercise.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <Badge 
              className={`absolute bottom-3 left-3 ${getDifficultyColor(exercise.difficulty)} font-medium px-2 py-1 text-xs border`}
            >
              {exercise.difficulty}
            </Badge>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-900 capitalize leading-tight">
              {exercise.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center space-y-1">
                <Target className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-500">Target</p>
                <p className="text-xs font-semibold text-gray-900 capitalize">{exercise.target}</p>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <Dumbbell className="w-4 h-4 text-green-600" />
                <p className="text-xs font-medium text-gray-500">Equipment</p>
                <p className="text-xs font-semibold text-gray-900 capitalize">{exercise.equipment}</p>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <Users className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-medium text-gray-500">Body Part</p>
                <p className="text-xs font-semibold text-gray-900 capitalize">{exercise.bodyPart}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExerciseCard;