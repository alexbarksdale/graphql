export const Subscription = {
    count: {
        subscribe(_, args, ctx) {
            const { pubsub } = ctx;

            let count = 0;

            setInterval(() => {
                count++;
                pubsub.publish('count', {
                    count,
                });
            }, 1000);

            // @arg1 - Channel name
            return pubsub.asyncIterator('count');
        },
    },
    comment: {
        subscribe(_, args, ctx) {
            const { postId } = args;
            const { db, pubsub } = ctx;

            const post = db.posts.find((post) => post.id === postId && post.published);
            if (!post) throw new Error('No post not found');

            return pubsub.asyncIterator(`comment ${postId}`);
        },
    },
    post: {
        subscribe(_, args, ctx) {
            return ctx.pubsub.asyncIterator('post');
        },
    },
};
