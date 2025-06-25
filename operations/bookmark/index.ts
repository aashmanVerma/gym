import BookMark from '@/models/bookmark';

// Save/Add bookmark
export const saveBookmark = async (userId: string, workoutId: number) => {
  try {
    // Check if bookmark already exists
    const existingBookmark = await BookMark.findOne({
      where: {
        userId,
        workoutId
      }
    });

    if (existingBookmark) {
      return {
        success: false,
        message: 'Workout is already bookmarked',
        bookmark: existingBookmark
      };
    }

    // Create new bookmark
    const newBookmark = await BookMark.create({
      userId,
      workoutId
    });

    return {
      success: true,
      message: 'Workout bookmarked successfully',
      bookmark: newBookmark
    };
  } catch (error) {
    throw new Error(`Failed to save bookmark: ${(error as Error).message}`);
  }
};

// Remove/Unmark bookmark
export const removeBookmark = async (userId: string, workoutId: number) => {
  try {
    const deletedCount = await BookMark.destroy({
      where: {
        userId,
        workoutId
      }
    });

    if (deletedCount === 0) {
      return {
        success: false,
        message: 'Bookmark not found'
      };
    }

    return {
      success: true,
      message: 'Bookmark removed successfully'
    };
  } catch (error) {
    throw new Error(`Failed to remove bookmark: ${(error as Error).message}`);
  }
};

// Toggle bookmark (save if not exists, remove if exists)
export const toggleBookmark = async (userId: string, workoutId: number) => {
  try {
    const existingBookmark = await BookMark.findOne({
      where: {
        userId,
        workoutId
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await BookMark.destroy({
        where: {
          userId,
          workoutId
        }
      });

      return {
        success: true,
        action: 'removed',
        message: 'Bookmark removed successfully',
        isBookmarked: false
      };
    } else {
      // Add bookmark
      const newBookmark = await BookMark.create({
        userId,
        workoutId
      });

      return {
        success: true,
        action: 'added',
        message: 'Workout bookmarked successfully',
        bookmark: newBookmark,
        isBookmarked: true
      };
    }
  } catch (error) {
    throw new Error(`Failed to toggle bookmark: ${(error as Error).message}`);
  }
};

// Check if workout is bookmarked by user
export const isWorkoutBookmarked = async (userId: string, workoutId: number) => {
  try {
    const bookmark = await BookMark.findOne({
      where: {
        userId,
        workoutId
      }
    });

    return {
      isBookmarked: !!bookmark,
      bookmark: bookmark || null
    };
  } catch (error) {
    throw new Error(`Failed to check bookmark status: ${(error as Error).message}`);
  }
};

// Get user's bookmarked workouts with pagination
interface GetUserBookmarksOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const getUserBookmarks = async (userId: string, options: GetUserBookmarksOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = options;

  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await BookMark.findAndCountAll({
      where: { userId },
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // Manually fetch workout data for each bookmark
    const Workout = (await import('@/models/workout')).default;
    const bookmarksWithWorkouts = await Promise.all(
      rows.map(async (bookmark) => {
        const bookmarkData = bookmark.toJSON() as any;
        const workout = await Workout.findByPk(bookmarkData.workoutId);
        return {
          ...bookmarkData,
          workout: workout?.toJSON() || null
        };
      })
    );

    const totalPages = Math.ceil(count / limit);

    return {
      bookmarks: bookmarksWithWorkouts,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookmarks: count,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch user bookmarks: ${(error as Error).message}`);
  }
};

// Get workout bookmark count (how many users bookmarked this workout)
export const getWorkoutBookmarkCount = async (workoutId: number) => {
  try {
    const count = await BookMark.count({
      where: { workoutId }
    });

    return {
      workoutId,
      bookmarkCount: count
    };
  } catch (error) {
    throw new Error(`Failed to get bookmark count: ${(error as Error).message}`);
  }
};

// Remove all bookmarks for a user
export const clearUserBookmarks = async (userId: string) => {
  try {
    const deletedCount = await BookMark.destroy({
      where: { userId }
    });

    return {
      success: true,
      message: `Cleared ${deletedCount} bookmarks`,
      deletedCount
    };
  } catch (error) {
    throw new Error(`Failed to clear user bookmarks: ${(error as Error).message}`);
  }
};