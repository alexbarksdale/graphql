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
        const { db, pubsub } = ctx;
        const userExits = db.users.some((user) => user.id == args.data.author);

        if (!userExits) throw new Error('User not found');

        const post = {
            id: uuidv4(),
            ...args.data,
        };

        db.posts.push(post);

        if (args.data.published)
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post,
                },
            });

        return post;
    },
    deletePost(_, args, ctx) {
        const { db, pubsub } = ctx;
        const postIndex = db.posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) throw new Error('Post not found');

        const [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post,
                },
            });
        }

        return post;
    },
    updatePost(_, args, ctx) {
        const { db, pubsub } = ctx;

        const post = db.posts.find((post) => post.id === args.id);
        const originalPost = { ...post };
        if (!post) throw new Error('No post found');

        if (typeof args.data.title === 'string') post.title = args.data.title;
        if (typeof args.data.body === 'string') post.body = args.data.body;
        if (typeof args.data.published === 'boolean') {
            post.published = args.data.published;

            if (originalPost.published && !post.published) {
                // deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost,
                    },
                });
            } else if (!originalPost.published && post.published) {
                // created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post,
                    },
                });
            }
        } else if (post.published) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post,
                },
            });
        }

        return post;
    },
    createComment(_, args, ctx) {
        const { db, pubsub } = ctx;

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

        // Updates subscribers
        pubsub.publish(`comment ${args.data.post}`, { comment });

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
