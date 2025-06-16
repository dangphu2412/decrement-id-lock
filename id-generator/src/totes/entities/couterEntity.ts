import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('counters')
export class CounterEntity {
  @PrimaryColumn({
    type: 'date',
    name: 'id',
  })
  id: string;

  @Column({
    type: 'integer',
    name: 'sequence',
  })
  sequence: number;
}
