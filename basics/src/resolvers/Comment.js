export const Comment = {
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
};
