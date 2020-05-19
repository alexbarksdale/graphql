import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// demo user data
let users = [
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

let posts = [
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

let comments = [
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
    Mutation: {
        createUser(_, args) {
            const wasEmailTaken = users.some((user) => user.email === args.data.email);
            if (wasEmailTaken) throw new Error('Email already taken');

            const user = {
                id: uuidv4(),
                ...args.data,
            };

            users.push(user);
            return user;
        },
        // Disgusting
        deleteUser(_, args) {
            const userIndex = users.findIndex((user) => user.id === args.id);
            if (userIndex === -1) throw new Error('User not found');

            const deletedUser = users.splice(userIndex, 1);

            posts = posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id);
                }
                return !match;
            });

            comments = comments.filter((comment) => comment.author !== args.id);

            return deletedUser[0];
        },
        createPost(_, args) {
            const userExits = users.some((user) => user.id == args.data.author);

            if (!userExits) throw new Error('User not found');

            const post = {
                id: uuidv4(),
                ...args.data,
            };

            posts.push(post);
            return post;
        },
        createComment(_, args) {
            const userExists = users.some((user) => user.id === args.data.author);

            const postExists = posts.some(
                (post) => post.id === args.data.post && post.published
            );
            if (!postExists || !userExists) throw new Error('Unable to create comment');

            const comment = {
                id: uuidv4(),
                ...args.data,
            };

            comments.push(comment);
            return comment;
        },
    },
    // Runs if we provide a relational type
    Post: {
        // parent refers to Post
        author(parent) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        // parent refers to Post
        comments(parent) {
            return comments.filter((comment) => comment.post === parent.id);
        },
    },
    // Runs if we provide a relational type
    User: {
        // parent refers to User
        posts(parent) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        // parent refers to User
        comments(parent) {
            return comments.filter((comment) => comment.author === parent.id);
        },
    },
    Comment: {
        // parent refers to Comment
        author(parent) {
            return users.find((user) => user.id === parent.author);
        },
        // parent refers to Comment
        post(parent) {
            return posts.find((post) => post.id === parent.post);
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
