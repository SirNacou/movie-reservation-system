import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Movie } from './domain/movie.entity.js';
import { ListMoviesEndpoint } from './list-movies/list-movies-endpoint.js';

@Module({
	imports: [MikroOrmModule.forFeature([Movie])],
	controllers: [ListMoviesEndpoint],
})
export class MoviesModule {}
