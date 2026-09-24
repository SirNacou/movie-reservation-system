import { Migration } from '@mikro-orm/migrations';

export class Migration20260924142135 extends Migration {
	override name = 'Migration20260924142135';

	override up(): void | Promise<void> {
		this.addSql(`alter table "movies" add "tmdb_id" int not null;`);
	}

	override down(): void | Promise<void> {
		this.addSql(`alter table "movies" drop column "tmdb_id";`);
	}
}
