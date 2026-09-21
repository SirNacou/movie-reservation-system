import { sql } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const moviesTable = pgTable('movies', {
	id: uuid().primaryKey().default(sql`uuidv7()`),
	title: text().notNull(),
	description: text().default(''),
});
