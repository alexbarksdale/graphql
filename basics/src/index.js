import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        me: User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`;

// Resolvers (functions)
const resolvers = {
    Query: {
        me() {
            return {
                id: '123',
                name: 'Alex',
                email: 'alex@gmail.com',
                age: 20,
            };
        },
        greeting(_, args) {
            if (args.name) return `Hello ${args.name}`;
            return 'Hello';
        },
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log('The server is up');
});

