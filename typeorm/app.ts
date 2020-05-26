import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import {
    UsersEntity,
    PostEntity,
    CategoriesEntity,
    CategoriesPostsEntity,
} from './entities/allEntities.helper';
import { createUsers } from './crud';

const app = async () => {
    const connection: Connection = await createConnection({
        type: 'sqlite',
        database: './db/typeorm.db',
        entities: [UsersEntity, PostEntity, CategoriesEntity, CategoriesPostsEntity],
    });

    // don't pass true on production server
    await connection.synchronize(true);
    await createUsers(connection);
};

app();
