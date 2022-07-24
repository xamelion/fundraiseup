import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private readonly model: Model<TrackDocument>,
  ) {}

  createAll(tracks: TrackDto[]): Promise<TrackDocument[]> {
    return this.model.insertMany(tracks);
  }
}
