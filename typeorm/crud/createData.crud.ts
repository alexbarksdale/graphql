import { Connection, Repository } from 'typeorm';
import { name, internet, random, date, lorem, hacker } from 'faker';
import {
    UsersEntity,
    PostEntity,
    CategoriesEntity,
    CategoriesPostsEntity,
} from '../entities/allEntities.helper';
import { writeFileSync } from 'fs';

const createUsers = async (con: Connection) => {
    const users: Array<UsersEntity> = [];

    for (const _ of Array.from({ length: 10 })) {
        const firstName = name.firstName();
        const lastName = name.lastName();
        const isActive = random.arrayElement([true, false]);
        const email = internet.email();
        const password = internet.password();
        const birthDate = date.past();

        const user: Partial<UsersEntity> = new UsersEntity(
            firstName,
            lastName,
            isActive,
            email,
            birthDate,
            password
        );

        users.push((await con.manager.save(user)) as UsersEntity);
    }

    await createPosts(con, users);
};

const createPosts = async (con: Connection, users: Array<UsersEntity>) => {
    const posts: Array<PostEntity> = [];
    for (const user of users) {
        const body = lorem.paragraphs();
        const post1 = new PostEntity(body);
        const post2 = new PostEntity(body);
        post1.user = user;
        post2.user = user;
        posts.push((await con.manager.save(post1)) as PostEntity);
        posts.push((await con.manager.save(post2)) as PostEntity);
    }

    await readUsers(con);
    await manyToManyCreate(con, posts);
};

const manyToManyCreate = async (con: Connection, posts: Array<PostEntity>) => {
    await createCat(con);
    const categoriesRepository: Repository<CategoriesEntity> = con.getRepository(CategoriesEntity);
    const categoriesPostsReposistory: Repository<CategoriesPostsEntity> = con.getRepository(
        CategoriesPostsEntity
    );

    const categories: Array<CategoriesEntity> = await categoriesRepository.find();

    for (const post of posts) {
        const someColumn = hacker.adjective();
        const catPost = new CategoriesPostsEntity(
            someColumn,
            post,
            random.arrayElement(categories)
        );

        await categoriesPostsReposistory.save(catPost);
    }
};

const createCat = async (con: Connection) => {
    const categoriesRepository: Repository<CategoriesEntity> = con.getRepository(CategoriesEntity);

    for (const _ of Array.from({ length: 10 })) {
        const label = hacker.verb();
        const categoryToSave: Partial<CategoriesEntity> = new CategoriesEntity(label);

        await categoriesRepository.save(categoryToSave);
    }
};

// More find options: https://typeorm.io/#/find-options
const readUsers = async (con: Connection) => {
    const userRepository: Repository<UsersEntity> = con.getRepository(UsersEntity);
    // const users = await userRepository.find();

    // const users = await userRepository.find({
    //     order: { birthDate: 'ASC' },
    //     select: ['firstName', 'birthDate', 'email', 'id'],
    // });

    // const users = await userRepository.find({ take: 1, skip: 6 });

    // const users = await userRepository.findOne(8);

    // const users = await userRepository.find({ where: { firstName: 'road' } });

    const users = await userRepository.find({ relations: ['posts'] });

    // const users = await userRepository.find({ where: { firstName: 'Ebba' }, relations: ['posts'] });

    writeFileSync('data.json', JSON.stringify(users, null, 2));
};

export { createUsers };
