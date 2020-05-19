export const Post = {
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
};
