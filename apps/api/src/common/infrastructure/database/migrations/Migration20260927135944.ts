import { Migration } from '@mikro-orm/migrations'

export class Migration20260927135944 extends Migration {
	override name = 'Migration20260927135944'

	override up(): void | Promise<void> {
		this.addSql(
			`create table "cinemas" ("id" uuid not null, "name" varchar(255) not null, "city" varchar(100) not null, "address" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
		)

		this.addSql(
			`create table "auditoriums" ("id" uuid not null, "cinema_id" uuid not null, "name" varchar(100) not null, "total_seats" int not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
		)

		this.addSql(
			`create table "movies" ("id" uuid not null, "tmdb_id" int not null, "title" varchar(255) not null, "description" text not null, "duration_minutes" int not null, "poster_url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
		)

		this.addSql(
			`create table "seats" ("id" uuid not null, "auditorium_id" uuid not null, "row" varchar(5) not null, "number" int not null, "type" text not null default 'REGULAR', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
		)
		this.addSql(
			`alter table "seats" add constraint "seats_auditorium_id_row_number_unique" unique ("auditorium_id", "row", "number");`,
		)
		this.addSql(
			`alter table "seats" add constraint "seats_type_check" check ("type" in ('REGULAR', 'VIP', 'COUPLE', 'ACCESSIBLE'));`,
		)

		this.addSql(
			`alter table "auditoriums" add constraint "auditoriums_cinema_id_foreign" foreign key ("cinema_id") references "cinemas" ("id");`,
		)

		this.addSql(
			`alter table "seats" add constraint "seats_auditorium_id_foreign" foreign key ("auditorium_id") references "auditoriums" ("id");`,
		)
	}
}
