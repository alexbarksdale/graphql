import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
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
            const { name } = args;
            if (name) return `Hello ${name}`;
            return 'Hello';
        },
        add(_, args) {
            const { numbers } = args;
            if (numbers.length === 0) return 0;

            return numbers.reduce((accumulator, currVal) => accumulator + currVal);
        },
        grades() {
            return [99, , 76, 47];
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

