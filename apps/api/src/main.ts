import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});

	app.enableShutdownHooks();
	app.setGlobalPrefix('api');

	await app.listen(4000, '0.0.0.0');
}
bootstrap();
