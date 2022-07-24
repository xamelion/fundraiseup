import { Controller, Post, Req } from '@nestjs/common';
import * as rawBody from 'raw-body';

import { TrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@Controller()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('/track')
  create(@Req() req): string {
    rawBody(req).then((raw) => {
      const text = raw.toString().trim();
      const tracks = JSON.parse(text) as TrackDto[];

      this.trackService.createAll(tracks);
    });

    return '';
  }
}
