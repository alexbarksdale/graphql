import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

import { db } from './db';

const resolvers = {
    Query: {
        // This is known as a resolver
        users(_, args, ctx) {
            const { db } = ctx;

            if (!args.query) return db.users;

            return db.users.filter((user) =>
                user.name.toLowerCase().includes(args.query.toLowerCase())
            );
        },
        posts(_, args, ctx) {
            const { db } = ctx;
            if (!args.query) return posts;

            return db.posts.filter((post) => {
                const titleMatch = post.title
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
                const bodyMatch = post.body
                    .toLowerCase()
                    .includes(args.query.toLowerCase());

                return titleMatch || bodyMatch;
            });
        },
        comments(_, args, ctx) {
            return ctx.db.comments;
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
        createUser(_, args, ctx) {
            const { db } = ctx;
            const wasEmailTaken = db.users.some((user) => user.email === args.data.email);
            if (wasEmailTaken) throw new Error('Email already taken');

            const user = {
                id: uuidv4(),
                ...args.data,
            };

            db.users.push(user);
            return user;
        },
        // Disgusting
        deleteUser(_, args, ctx) {
            const { db } = ctx;
            const userIndex = db.users.findIndex((user) => user.id === args.id);
            if (userIndex === -1) throw new Error('User not found');

            const deletedUser = db.users.splice(userIndex, 1);

            db.posts = db.posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    db.comments = db.comments.filter(
                        (comment) => comment.post !== post.id
                    );
                }
                return !match;
            });

            db.comments = db.comments.filter((comment) => comment.author !== args.id);

            return deletedUser[0];
        },
        createPost(_, args, ctx) {
            const { db } = ctx;
            const userExits = db.users.some((user) => user.id == args.data.author);

            if (!userExits) throw new Error('User not found');

            const post = {
                id: uuidv4(),
                ...args.data,
            };

            db.posts.push(post);
            return post;
        },
        deletePost(_, args, ctx) {
            const { db } = ctx;
            const postIndex = db.posts.findIndex((post) => post.id === args.id);

            if (postIndex === -1) throw new Error('Post not found');

            const deletedPosts = db.posts.splice(postIndex, 1);

            db.comments = db.comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];
        },
        createComment(_, args, ctx) {
            const { db } = ctx;
            const userExists = db.users.some((user) => user.id === args.data.author);

            const postExists = db.posts.some(
                (post) => post.id === args.data.post && post.published
            );
            if (!postExists || !userExists) throw new Error('Unable to create comment');

            const comment = {
                id: uuidv4(),
                ...args.data,
            };

            db.comments.push(comment);
            return comment;
        },
        deleteComment(_, args, ctx) {
            const { db } = ctx;
            const commentIndex = db.comments.findIndex(
                (comment) => comment.id === args.id
            );

            if (commentIndex === -1) throw new Error('Comment not found');

            const deletedComments = db.comments.splice(commentIndex, 1);
            return deletedComments[0];
        },
    },
    // Runs if we provide a relational type
    Post: {
        // parent refers to Post
        author(parent, _, ctx) {
            const { db } = ctx;
            return db.users.find((user) => {
                return user.id === parent.author;
            });
        },
        // parent refers to Post
        comments(parent, _, ctx) {
            const { db } = ctx;
            return db.comments.filter((comment) => comment.post === parent.id);
        },
    },
    // Runs if we provide a relational type
    User: {
        // parent refers to User
        posts(parent, _, ctx) {
            const { db } = ctx;
            return db.posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        // parent refers to User
        comments(parent, _, ctx) {
            const { db } = ctx;
            return db.comments.filter((comment) => comment.author === parent.id);
        },
    },
    Comment: {
        // parent refers to Comment
        author(parent, _, ctx) {
            const { db } = ctx;
            return db.users.find((user) => user.id === parent.author);
        },
        // parent refers to Comment
        post(parent, _, ctx) {
            const { db } = ctx;
            return db.posts.find((post) => post.id === parent.post);
        },
    },
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db,
    },
});

server.start(() => {
    console.log('The server is up');
});
