// apps/api/src/mikro-orm.config.ts
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { env } from './env.js';

export default defineConfig({
	clientUrl: env.DATABASE_URL,
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
});
