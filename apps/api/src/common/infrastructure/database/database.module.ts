import { Module, OnApplicationShutdown, Provider } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import env from '../../../env.js';
import { relations } from './schema/relations.js';

export const DRIZZLE_DB = Symbol('DRIZZLE_DB');
export type DrizzleDb = NodePgDatabase;

const poolProvider: Provider = {
	provide: 'PG_POOL',
	useFactory: () =>
		new Pool({
			connectionString: env.DATABASE_URL,
			max: 20,
			idleTimeoutMillis: 30 * 1000,
			connectionTimeoutMillis: 2 * 1000,
		}),
};

const drizzleProvider: Provider = {
	provide: DRIZZLE_DB,
	inject: ['PG_POOL'],
	useFactory: (pool: Pool) => {
		return drizzle({ client: pool, relations });
	},
};

@Module({
	providers: [poolProvider, drizzleProvider],
	exports: [DRIZZLE_DB],
})
export class DatabaseModule implements OnApplicationShutdown {
	constructor() {}
	onApplicationShutdown(_?: string) {}
}
