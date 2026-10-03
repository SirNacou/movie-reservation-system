import { Migrator } from '@mikro-orm/migrations'
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import type { Environment } from './env.config.js'

type MikroOrmEnvironment = Pick<Environment, 'DATABASE_URL' | 'NODE_ENV'>

export function createMikroOrmOptions(env: MikroOrmEnvironment) {
	return defineConfig({
		clientUrl: env.DATABASE_URL,
		driver: PostgreSqlDriver,
		entities: ['./dist/**/*.entity.js'],
		entitiesTs: ['./src/**/*.entity.ts'],
		extensions: [Migrator],
		migrations: {
			path: './dist/common/infrastructure/database/migrations',
			pathTs: './src/common/infrastructure/database/migrations',
			tableName: 'mikro_orm_migrations',
			transactional: true,
			allOrNothing: true,
			emit: 'ts',
		},
		debug: env.NODE_ENV !== 'production',
	})
}
