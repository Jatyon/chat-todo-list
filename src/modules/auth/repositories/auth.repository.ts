import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuthRefreshToken } from '@modules/auth/entities/auth-refresh-token.entity';

@Injectable()
export class AuthRepository extends Repository<AuthRefreshToken> {
  constructor(private dataSource: DataSource) {
    super(AuthRefreshToken, dataSource.createEntityManager());
  }
}
