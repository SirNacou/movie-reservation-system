import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { Cinema } from './domain/cinema.entity.js'

@Module({
	imports: [MikroOrmModule.forFeature([Cinema])],
	controllers: [],
	providers: [],
	exports: [],
})
export class CinemaModule {}
