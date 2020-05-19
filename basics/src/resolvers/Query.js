export const Query = {
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
            const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());

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
};
