import { ApiKey } from 'src/auth/entities/api-key.entity';
import { Form } from './entities/form.entity';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Form, ApiKey])],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
