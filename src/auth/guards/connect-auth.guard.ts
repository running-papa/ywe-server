import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ConnectAuthGuard extends AuthGuard('connect') {}
