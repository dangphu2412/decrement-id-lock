import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;
}
