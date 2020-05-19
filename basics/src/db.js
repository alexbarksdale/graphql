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

export const db = {
    users,
    posts,
    comments,
};
