import mikroOrmConfig from '@/mikro-orm.config.js';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware/middleware-consumer.interface.js';

@Module({
	imports: [MikroOrmModule.forRoot(mikroOrmConfig)],
})
export class DatabaseModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MikroOrmMiddleware).forRoutes('*');
	}
}
