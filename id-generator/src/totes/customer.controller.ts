import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customerEntity';
import { DataSource, Repository } from 'typeorm';
import { CounterEntity } from './entities/couterEntity';

class CreateCustomerDTO {
  name: string;
}

const MAX_REQUESTS_PER_DAY = 9999999;

@Controller('customers')
export class CustomerController {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  findCustomers() {
    return this.customerRepository.find();
  }

  @Post()
  async createCustomers(@Body() dto: CreateCustomerDTO) {
    const today = new Date().toISOString().split('T')[0];

    await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(CounterEntity)
        .values({ id: today, sequence: MAX_REQUESTS_PER_DAY })
        .orIgnore()
        .execute();

      Logger.log('Initiating counter');
      const sequenceRow = await manager
        .createQueryBuilder(CounterEntity, 'seq')
        .setLock('pessimistic_write')
        .where('seq.id = :today', { today })
        .getOne();
      Logger.log('Select lock counter');

      if (!sequenceRow) {
        throw new Error('Could not lock sequence row');
      }

      await manager
        .createQueryBuilder()
        .update(CounterEntity)
        .set({ sequence: () => 'sequence - 1' })
        .where('id = :today', { today })
        .execute();

      Logger.log('Decrement the counter');

      const id = `CUST${today.replaceAll('-', '')}${String(sequenceRow.sequence).padStart(6, '0')}`;

      await manager.save(CustomerEntity, {
        id,
        name: dto.name,
      });
    });

    return;
  }
}
