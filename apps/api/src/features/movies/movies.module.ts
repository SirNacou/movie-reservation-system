import { Module } from '@nestjs/common';
import { ListMoviesEndpoint } from './list-movies/list-movies-endpoint.js';

@Module({
	controllers: [ListMoviesEndpoint],
})
export class MoviesModule {}
