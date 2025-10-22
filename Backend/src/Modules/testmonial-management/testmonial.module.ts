import { Module } from '@nestjs/common';
import { TestimonialService } from './testmonial.service';
import { TestimonialController } from './testmonial.controller';
@Module({
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
