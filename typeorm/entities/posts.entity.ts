import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { SharedProp } from './sharedProp.helper';
import { UsersEntity, CategoriesPostsEntity } from './allEntities.helper';

@Entity({ name: 'posts' })
export class PostEntity extends SharedProp {
    constructor(body: string) {
        super();
        this.body = body;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    body: string;

    // arg1: The class that should have a relationship with this class.
    // arg2: How we should access the relationship from the other class (user in this case)
    // Creates a column called userId which is a ForeignKey referencing the users table
    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.posts)
    // Can be use on both one-to-one and many-to-one relations to specifiy custom column name
    // or custom referenced column
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;

    @OneToMany(
        () => CategoriesPostsEntity,
        (categoryPosts: CategoriesPostsEntity) => categoryPosts.post
    )
    categoriesPosts: Array<CategoriesPostsEntity>;
}
