import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const UserActivity = sequelize.define('userActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.TEXT, // Match better-auth user IDs
    allowNull: false,
  },
  activityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
    allowNull: false,
  },
  caloriesBurned: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Other',
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Moderate', 'Hard'),
    allowNull: false,
    defaultValue: 'Moderate',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY, // Store just the date
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'userActivity',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['date'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['userId', 'date'], // For efficient user daily queries
    },
  ]
});

export default UserActivity; 