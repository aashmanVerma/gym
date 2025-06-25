import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const BookMark = sequelize.define('bookmark', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  workoutId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'bookmark',
  timestamps: true, // includes createdAt (useful for ordering), updatedAt
  indexes: [
    {
      unique: true,
      fields: ['userId', 'workoutId'], // one save per user per workout
    },
    {
      fields: ['userId'], // for efficient user bookmark queries
    },
    {
      fields: ['workoutId'], // for efficient workout bookmark queries
    },
  ]
});

export default BookMark;