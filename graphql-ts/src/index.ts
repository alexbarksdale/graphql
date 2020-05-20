import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { HelloWorldResolver } from './resolvers/HelloWorldResolver';
import { MovieResolver } from './resolvers/movie.resolver';

(async () => {
    const app = express();

    const options = await getConnectionOptions(process.env.NODE_ENV || 'development');
    await createConnection({ ...options, name: 'default' });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloWorldResolver, MovieResolver],
            validate: true,
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}/graphql`);
    });
})();
