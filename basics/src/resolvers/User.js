export const User = {
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
};
