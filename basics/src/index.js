import { GraphQLServer } from 'graphql-yoga';

// demo user data
const users = [
    {
        id: '1',
        name: 'Felix',
        email: 'felix@gmail.com',
    },
    {
        id: '2',
        name: 'Alex',
        email: 'alex@gmail.com',
        age: 20,
    },
];

const posts = [
    {
        id: '10',
        title: 'Dog',
        body: 'dog body',
        published: true,
    },
    {
        id: '8',
        title: 'Cats',
        body: 'cat body',
        published: false,
    },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        add(numbers: [Float!]!): Float!
        greeting(name: String): String!
        grades: [Int!]!
        posts(query: String): [Post!]!
        me: User!
        users(query: String): [User!]!
        post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers (functions)
const resolvers = {
    Query: {
        users(_, args) {
            const { query } = args;
            if (!query) return users;

            return users.filter((user) =>
                user.name.toLowerCase().includes(query.toLowerCase())
            );
        },
        posts(_, args) {
            const { query } = args;
            if (!query) return posts;

            return posts.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(query.toLowerCase());
                const bodyMatch = post.body.toLowerCase().includes(query.toLowerCase());

                return titleMatch || bodyMatch;
            });
        },
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

