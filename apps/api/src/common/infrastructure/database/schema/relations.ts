import { defineRelations } from 'drizzle-orm';
import { moviesTable } from './movies.schema.js';

export const relations = defineRelations({ moviesTable: moviesTable }, (r) => ({}));
