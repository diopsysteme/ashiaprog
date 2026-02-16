import { Injectable } from '@nestjs/common';

@Injectable()
export class FilemanagementService {
  getHello(): string {
    return 'Hello World file!';
  }
}
