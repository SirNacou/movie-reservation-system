import { Migration } from '@mikro-orm/migrations';

export class Migration20260922162009 extends Migration {
	override name = 'Migration20260922162009';

	override up(): void | Promise<void> {
		this.addSql(
			`create table "movies" ("id" uuid not null, "title" varchar(255) not null, "description" text not null, "duration_minutes" int not null, "poster_url" text not null, primary key ("id"));`,
		);
	}
}
