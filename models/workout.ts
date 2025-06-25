// models/Workout.js
import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Workout = sequelize.define('workout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    allowNull: false,
  },
  calories: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1), // allows values like 4.5
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  instructor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.TEXT, // using TEXT for URL storage
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON, // stores array of strings as JSON
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'workout',
  timestamps: true,
  indexes: [
    {
      fields: ['category'],
    },
    {
      fields: ['difficulty'],
    },
    {
      fields: ['instructor'],
    },
    {
      fields: ['rating'],
    },
  ]
});

export default Workout;