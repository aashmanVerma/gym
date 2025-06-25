import UserActivity from '@/models/userActivity';
import { Op } from 'sequelize';
import sequelize from '@/lib/sequelize';

// Create new activity
export const createActivity = async (activityData: {
  userId: string;
  activityName: string;
  description?: string;
  duration: number;
  caloriesBurned: number;
  category?: string;
  difficulty?: 'Easy' | 'Moderate' | 'Hard';
  notes?: string;
  date?: string;
}) => {
  try {
    const activity = await UserActivity.create(activityData);
    return {
      success: true,
      message: 'Activity logged successfully',
      activity: activity.toJSON()
    };
  } catch (error) {
    throw new Error(`Failed to create activity: ${(error as Error).message}`);
  }
};

// Get user activities with pagination
interface GetUserActivitiesOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const getUserActivities = async (userId: string, options: GetUserActivitiesOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'DESC',
    category,
    startDate,
    endDate
  } = options;

  const offset = (page - 1) * limit;
  const whereClause: any = { userId };

  if (category) {
    whereClause.category = category;
  }

  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date[Op.gte] = startDate;
    if (endDate) whereClause.date[Op.lte] = endDate;
  }

  try {
    const { count, rows } = await UserActivity.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    const totalPages = Math.ceil(count / limit);

    return {
      activities: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalActivities: count,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch user activities: ${(error as Error).message}`);
  }
};

// Get user statistics
export const getUserStats = async (userId: string) => {
  try {
    // Get total activities
    const totalActivities = await UserActivity.count({ where: { userId } });

    // Get total duration and calories
    const totals = await UserActivity.findOne({
      where: { userId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCalories']
      ]
    });

    // Get current streak
    const activities = await UserActivity.findAll({
      where: { userId },
      attributes: ['date'],
      order: [['date', 'DESC']],
      limit: 30 // Check last 30 days
    });

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const hasActivity = activities.some(activity => 
        activity.get('date') === dateStr
      );

      if (hasActivity) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Get category breakdown
    const categoryStats = await UserActivity.findAll({
      where: { userId },
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCalories']
      ],
      group: ['category']
    });

    return {
      totalActivities,
      totalDuration: parseInt(totals?.get('totalDuration') as string) || 0,
      totalCalories: parseInt(totals?.get('totalCalories') as string) || 0,
      currentStreak,
      categoryStats: categoryStats.map(stat => ({
        category: stat.get('category'),
        count: parseInt(stat.get('count') as string),
        totalDuration: parseInt(stat.get('totalDuration') as string),
        totalCalories: parseInt(stat.get('totalCalories') as string)
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch user stats: ${(error as Error).message}`);
  }
};

// Update activity
export const updateActivity = async (activityId: number, userId: string, updateData: any) => {
  try {
    const activity = await UserActivity.findOne({
      where: { id: activityId, userId }
    });

    if (!activity) {
      return {
        success: false,
        message: 'Activity not found'
      };
    }

    await activity.update(updateData);

    return {
      success: true,
      message: 'Activity updated successfully',
      activity: activity.toJSON()
    };
  } catch (error) {
    throw new Error(`Failed to update activity: ${(error as Error).message}`);
  }
};

// Delete activity
export const deleteActivity = async (activityId: number, userId: string) => {
  try {
    const deletedCount = await UserActivity.destroy({
      where: { id: activityId, userId }
    });

    if (deletedCount === 0) {
      return {
        success: false,
        message: 'Activity not found'
      };
    }

    return {
      success: true,
      message: 'Activity deleted successfully'
    };
  } catch (error) {
    throw new Error(`Failed to delete activity: ${(error as Error).message}`);
  }
};

// Get recent activities (last 7 days)
export const getRecentActivities = async (userId: string, days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const activities = await UserActivity.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDateStr
        }
      },
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 10
    });

    return activities.map(activity => activity.toJSON());
  } catch (error) {
    throw new Error(`Failed to fetch recent activities: ${(error as Error).message}`);
  }
}; 