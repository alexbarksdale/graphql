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
        author: '1',
    },
    {
        id: '8',
        title: 'Cats',
        body: 'cat body',
        published: false,
        author: '2',
    },
];

const comments = [
    {
        id: '17',
        text: 'Fluffy dog',
        author: '1',
    },
    {
        id: '82',
        text: 'Naked cat',
        author: '2',
    },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
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
        comments() {
            return comments;
        },
        me() {
            return {
                id: '123',
                name: 'Alex',
                email: 'alex@gmail.com',
                age: 20,
            };
        },
    },
    // Runs if we provide a relational type
    Post: {
        author(obj) {
            return users.find((user) => {
                return user.id === obj.author;
            });
        },
    },
    // Runs if we provide a relational type
    User: {
        posts(obj) {
            return posts.filter((post) => {
                return post.author === obj.id;
            });
        },
        comments(obj) {
            return comments.filter((comment) => comment.author === obj.id);
        },
    },
    Comment: {
        author(obj) {
            return users.find((user) => user.id === obj.author);
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
