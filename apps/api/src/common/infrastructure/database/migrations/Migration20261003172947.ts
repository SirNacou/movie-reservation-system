import { Migration } from '@mikro-orm/migrations';

export class Migration20261003172947 extends Migration {

  override name = 'Migration20261003172947';

  override up(): void | Promise<void> {
    this.addSql(`create table "showtimes" ("id" uuid not null, "movie_id" uuid not null, "auditorium_id" uuid not null, "start_time" timestamptz not null, "end_time" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`create index "showtimes_auditorium_id_start_time_end_time_index" on "showtimes" ("auditorium_id", "start_time", "end_time");`);
    this.addSql(`create index "showtimes_movie_id_start_time_index" on "showtimes" ("movie_id", "start_time");`);

    this.addSql(`alter table "showtimes" add constraint "showtimes_movie_id_foreign" foreign key ("movie_id") references "movies" ("id");`);
    this.addSql(`alter table "showtimes" add constraint "showtimes_auditorium_id_foreign" foreign key ("auditorium_id") references "auditoriums" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "showtimes" cascade;`);
  }

}
