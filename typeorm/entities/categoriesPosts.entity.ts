import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { SharedProp } from './sharedProp.helper';
import { CategoriesEntity, PostEntity } from './allEntities.helper';

@Entity({ name: 'category_posts' })
export class CategoriesPostsEntity extends SharedProp {
    constructor(someColumn: string, post: PostEntity, category: CategoriesEntity) {
        super();
        this.someColumn = someColumn;
        this.post = post;
        this.category = category;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'some_column' })
    someColumn: string;

    @ManyToOne(() => PostEntity, (post: PostEntity) => post.categoriesPosts)
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;

    @ManyToOne(() => CategoriesEntity, (category: CategoriesEntity) => category.categoriesPosts)
    @JoinColumn({ name: 'category_id' })
    category: CategoriesEntity;
}
