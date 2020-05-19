import { v4 as uuidv4 } from 'uuid';

export const Mutation = {
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
                db.comments = db.comments.filter((comment) => comment.post !== post.id);
            }
            return !match;
        });

        db.comments = db.comments.filter((comment) => comment.author !== args.id);

        return deletedUser[0];
    },
    updateUser(_, args, ctx) {
        const { db } = ctx;
        const user = db.users.find((user) => user.id === args.id);

        if (!user) throw new Error('User not found');

        if (typeof args.data.email === 'string') {
            const emailTaken = db.users.some(() => user.email === args.data.email);

            if (emailTaken) throw new Error('Email taken');

            user.email = data.email;
        }

        if (typeof args.data.name === 'string') user.name = args.data.name;
        if (typeof args.data.age !== 'undefined') user.age = args.data.age;

        return user;
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
    updatePost(_, args, ctx) {
        const { db } = ctx;

        const post = db.posts.find((post) => post.id === args.id);
        if (!post) throw new Error('No post found');

        if (typeof args.data.title === 'string') post.title = args.data.title;
        if (typeof args.data.body === 'string') post.body = args.data.body;
        if (typeof args.data.published === 'boolean')
            post.published = args.data.published;

        return post;
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
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) throw new Error('Comment not found');

        const deletedComments = db.comments.splice(commentIndex, 1);
        return deletedComments[0];
    },
    updateComment(_, args, ctx) {
        const { db } = ctx;

        const comment = db.comments.find((comment) => comment.id === args.data.id);
        if (!comment) throw new Error('No comment found');

        if (typeof args.data.text === 'string') comment.text = args.data.text;

        return comment;
    },
};
