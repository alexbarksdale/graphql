import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

import { SharedProp } from './sharedProp.helper';
import { CategoriesPostsEntity } from './allEntities.helper';

// Example of enum usage
// enum CategoriesLabels {
//     coffee = 'coffee',
//     snacks = 'snacks',
//     time = 'time',
//     programming = 'programming',
// }

@Entity({ name: 'categories' })
export class CategoriesEntity extends SharedProp {
    constructor(label: string) {
        super();
        this.label = label;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @OneToMany(
        () => CategoriesPostsEntity,
        (categoriesPost: CategoriesPostsEntity) => categoriesPost.category
    )
    categoriesPosts: Array<CategoriesPostsEntity>;

    // Example of enum usage
    // @Column({
    //     type: 'enum',
    //     enum: CategoriesLabels,
    //     default: CategoriesLabels.programming,
    // })
}
