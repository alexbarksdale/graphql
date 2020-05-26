import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { SharedProp } from './sharedProp.helper';
import { PostEntity } from './posts.entity';

@Entity({ name: 'users' })
export class UsersEntity extends SharedProp {
    constructor(
        firstName: string,
        lastName: string,
        isActive: boolean,
        email: string,
        birthDate: Date,
        password: string
    ) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
        this.email = email;
        this.birthDate = birthDate;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    id: number;

    // name = name of the column in the database
    @Column({ name: 'first_name', nullable: false })
    firstName: string;

    @Column({ name: 'last_name', nullable: false })
    lastName: string;

    @Column({ name: 'is_active', nullable: false })
    isActive: boolean;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'birth_date', type: 'date', nullable: false })
    birthDate: Date;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => PostEntity, (post: PostEntity) => post.user, { cascade: true })
    posts: Array<PostEntity>;
}
