import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customerEntity';
import { CustomerController } from './customer.controller';
import { CounterEntity } from './entities/couterEntity';

@Module({
  controllers: [CustomerController],
  imports: [TypeOrmModule.forFeature([CustomerEntity, CounterEntity])],
})
export class CustomerModule {}
