import { Op } from "sequelize";
import Workout from "@/models/workout";

interface GetWorkoutsOptions {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  instructor?: string;
  minRating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC' | string;
}

export const getWorkouts = async (options: GetWorkoutsOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    category,
    difficulty,
    instructor,
    minRating,
    search,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = options;

  // Calculate offset
  const offset = (page - 1) * limit;

  // Build where clause for filtering
  const whereClause: any = {};
  
  if (category) {
    whereClause.category = category;
  }
  
  if (difficulty) {
    whereClause.difficulty = difficulty;
  }
  
  if (instructor) {
    whereClause.instructor = instructor;
  }
  
  if (minRating) {
    whereClause.rating = {
      [Op.gte]: minRating
    };
  }
  
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { instructor: { [Op.iLike]: `%${search}%` } },
      { category: { [Op.iLike]: `%${search}%` } }
    ];
  }

  try {
    const { count, rows } = await Workout.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      workouts: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalWorkouts: count,
        limit: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch workouts: ${(error as Error).message}`);
  }
};