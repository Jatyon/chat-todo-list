import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OwnerBoardGuard extends AuthGuard('owner-board') {}
