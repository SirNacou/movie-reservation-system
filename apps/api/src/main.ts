import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app.module.js'
import { generateOpenApiSpec } from './common/infrastructure/orpc.js'

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
	app.use(
		'/docs',
		apiReference({
			content: await generateOpenApiSpec(),
			withFastify: true,
		}),
	)

	await app.listen(4000, '0.0.0.0')
}

const _ = bootstrap()
