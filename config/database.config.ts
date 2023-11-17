import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmFactory implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.configService.getOrThrow('DB_HOST'),
      port: parseInt(this.configService.getOrThrow('DB_PORT')),
      username: this.configService.getOrThrow('DB_USER'),
      password: this.configService.getOrThrow('DB_PASSWORD'),
      database: this.configService.getOrThrow('DB_NAME'),
      entities: ['**/*.entity.js'],
      synchronize: Boolean(this.configService.getOrThrow('DB_SYNCHRONIZE')),
    };
  }
}
