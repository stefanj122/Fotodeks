import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watermark } from 'src/entity/watermark.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WatermarksService {
  constructor(
    @InjectRepository(Watermark)
    private readonly WatermarksRepository: Repository<Watermark>,
  ) {}
}
