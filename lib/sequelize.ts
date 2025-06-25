import config from '@/config'
import { Sequelize } from 'sequelize'
import pg from 'pg'

const sequelize = new Sequelize(config.database.url!, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 1000
  }
})

export default sequelize