import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module.js'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: process.env.NODE_ENV !== 'production' }),
		{
			bodyParser: false,
		},
	)

	app.enableShutdownHooks()
	app.setGlobalPrefix('api')

	await app.listen(4000, '0.0.0.0')
}

const _ = bootstrap()
