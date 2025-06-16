import { NestFactory } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CustomerEntity } from './totes/entities/customerEntity';
import { CustomerModule } from './totes/customer.module';
import { CounterEntity } from './totes/entities/couterEntity';

@Module({
  imports: [
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the .env file path
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here too
      inject: [ConfigService], // Inject ConfigService to use it in the factory
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [CustomerEntity, CounterEntity], // Add your entities here
        synchronize: false, // For local dev, set to false in production
        logging: true, // Set to true to see SQL queries (can be verbose)
        migrationsRun: true,
        migrations: [join(__dirname, 'database/migrations/*{.ts,.js}')],
      }),
    }),
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`${await app.getUrl()}`);
}

bootstrap();
