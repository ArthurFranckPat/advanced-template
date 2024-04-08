// import pg from 'pg'
// import { Kysely, PostgresDialect } from 'kysely'
// import env from '#start/env'
import type { DB } from '#types/db'
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'

// POSTGRES
// const { Pool } = pg

// const pool = new Pool({
//   host: env.get('DB_HOST'),
//   user: env.get('DB_USER'),
//   password: env.get('DB_PASSWORD'),
//   database: env.get('DB_DATABASE'),
//   max: 20,
// })

// const dialect = new PostgresDialect({
//   pool,
// })

const dialect = new SqliteDialect({
  database: new SQLite(app.makePath('tmp/db.sqlite')),
})

export const db = new Kysely<DB>({
  dialect,
  log(event) {
    if (app.inProduction) return

    if (event.level === 'query') {
      const formattedTime = (Math.round(event.queryDurationMillis * 100) / 100).toFixed(2)

      logger.info(`[SQL] ${event.query.sql} - ${formattedTime}ms`)
    }
  },
})
