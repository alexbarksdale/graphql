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
        id: '5',
        title: 'Dog',
        body: 'Dog body',
        published: true,
        author: '1',
    },
    {
        id: '6',
        title: 'Cats',
        body: 'Cat body',
        published: false,
        author: '2',
    },
];

const comments = [
    {
        id: '10',
        text: 'Dog comment',
        author: '1',
        post: '5',
    },
    {
        id: '20',
        text: 'Cat comment',
        author: '2',
        post: '6',
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
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

const resolvers = {
    Query: {
        // This is known as a resolver
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
        // obj refers to Post
        author(obj) {
            return users.find((user) => {
                return user.id === obj.author;
            });
        },
        // obj refers to Post
        comments(obj) {
            return comments.filter((comment) => comment.post === obj.id);
        },
    },
    // Runs if we provide a relational type
    User: {
        // obj refers to User
        posts(obj) {
            return posts.filter((post) => {
                return post.author === obj.id;
            });
        },
        // obj refers to User
        comments(obj) {
            return comments.filter((comment) => comment.author === obj.id);
        },
    },
    Comment: {
        // obj refers to Comment
        author(obj) {
            return users.find((user) => user.id === obj.author);
        },
        // obj refers to Comment
        post(obj) {
            return posts.find((post) => post.id === obj.post);
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
