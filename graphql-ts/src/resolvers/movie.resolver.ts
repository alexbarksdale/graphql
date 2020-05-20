import { Query, Field, Resolver, Mutation, Arg, Int, InputType } from 'type-graphql';
import { Movie } from '../entity/Movie';

@InputType()
class MovieInput {
    @Field()
    title: string;

    @Field(() => Int)
    minutes: number;
}

@InputType()
class MovieUpdateInput {
    @Field(() => String, { nullable: true })
    title: string | null;

    @Field(() => Int, { nullable: true })
    minutes: number | null;
}

@Resolver()
export class MovieResolver {
    @Mutation(() => Movie)
    async createMovie(@Arg('options', () => MovieInput) options: MovieInput) {
        const movie = await Movie.create(options).save();
        return movie;
    }

    @Mutation(() => Boolean)
    async updateMovie(
        @Arg('id', () => Int) id: number,
        @Arg('input', () => MovieUpdateInput) input: MovieInput
    ) {
        await Movie.update({ id }, input);
        return true;
    }

    @Mutation(() => Boolean)
    async deleteMovie(@Arg('id', () => Int) id: number) {
        await Movie.delete({ id });
        return true;
    }

    @Query(() => [Movie])
    movies() {
        return Movie.find();
    }

    // If it's nullable
    // @Mutation(() => Boolean)
    // createMovie(@Arg('title', () => String, {nullable: true}) title: string | null) {
    //     console.log(title);
    //     return true;
    // }
}
