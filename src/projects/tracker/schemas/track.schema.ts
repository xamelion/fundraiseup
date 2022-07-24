import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true, type: String })
  event: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Date })
  ts: Date;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
