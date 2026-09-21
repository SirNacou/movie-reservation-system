import { Controller, Inject } from '@nestjs/common';
import { Implement } from '@orpc/nest';
import { implement } from '@orpc/server';
import { contract } from '@repo/contract';
import { DRIZZLE_DB, type DrizzleDb } from '../../../common/infrastructure/database/database.module.js';
import { moviesTable } from '../../../common/infrastructure/database/schema/movies.schema.js';

@Controller()
export class ListMoviesEndpoint {
	constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

	@Implement(contract.movies.list)
	list() {
		return implement(contract.movies.list).handler(async () => {
			const movies = await this.db.select().from(moviesTable);
			return movies.map((m) => ({ id: m.id, name: m.title }));
		});
	}
}
