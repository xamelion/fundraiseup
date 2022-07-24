import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Track, TrackSchema } from './schemas/track.schema';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/fundraiseup'),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'dist', 'libs'),
      serveStaticOptions: {
        index: 'tracker.js',
      },
    }),
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackerModule {}
