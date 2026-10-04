import { Migration } from '@mikro-orm/migrations';

export class Migration20261004164739 extends Migration {

  override name = 'Migration20261004164739';

  override up(): void | Promise<void> {
    this.addSql(`create table "reservations" ("id" uuid not null, "showtime_id" uuid not null, "customer_email" varchar(255) not null, "customer_name" varchar(255) null, "status" text not null default 'PENDING', "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`create index "reservations_showtime_id_status_index" on "reservations" ("showtime_id", "status");`);
    this.addSql(`create index "reservations_customer_email_index" on "reservations" ("customer_email");`);

    this.addSql(`create table "reservation_seats" ("id" uuid not null, "reservation_id" uuid not null, "seat_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`create index "reservation_seats_reservation_id_seat_id_index" on "reservation_seats" ("reservation_id", "seat_id");`);

    this.addSql(`alter table "reservations" add constraint "reservations_showtime_id_foreign" foreign key ("showtime_id") references "showtimes" ("id");`);
    this.addSql(`alter table "reservations" add constraint "reservations_status_check" check ("status" in ('PENDING', 'CONFIRMED', 'CANCELLED'));`);

    this.addSql(`alter table "reservation_seats" add constraint "reservation_seats_reservation_id_foreign" foreign key ("reservation_id") references "reservations" ("id");`);
    this.addSql(`alter table "reservation_seats" add constraint "reservation_seats_seat_id_foreign" foreign key ("seat_id") references "seats" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "reservation_seats" drop constraint "reservation_seats_reservation_id_foreign";`);

    this.addSql(`drop table if exists "reservations" cascade;`);
    this.addSql(`drop table if exists "reservation_seats" cascade;`);
  }

}
