import { Migration } from '@mikro-orm/migrations';

export class Migration20260929173427 extends Migration {

  override name = 'Migration20260929173427';

  override up(): void | Promise<void> {
    this.addSql(`alter table "cinemas" alter column "created_at" drop default;`);
    this.addSql(`alter table "cinemas" alter column "updated_at" drop default;`);

    this.addSql(`alter table "auditoriums" alter column "created_at" drop default;`);
    this.addSql(`alter table "auditoriums" alter column "updated_at" drop default;`);

    this.addSql(`alter table "movies" alter column "created_at" drop default;`);
    this.addSql(`alter table "movies" alter column "updated_at" drop default;`);

    this.addSql(`alter table "seats" alter column "created_at" drop default;`);
    this.addSql(`alter table "seats" alter column "updated_at" drop default;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "auditoriums" alter column "created_at" set default now();`);
    this.addSql(`alter table "auditoriums" alter column "updated_at" set default now();`);

    this.addSql(`alter table "cinemas" alter column "created_at" set default now();`);
    this.addSql(`alter table "cinemas" alter column "updated_at" set default now();`);

    this.addSql(`alter table "movies" alter column "created_at" set default now();`);
    this.addSql(`alter table "movies" alter column "updated_at" set default now();`);

    this.addSql(`alter table "seats" alter column "created_at" set default now();`);
    this.addSql(`alter table "seats" alter column "updated_at" set default now();`);
  }

}
