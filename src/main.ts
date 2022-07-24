import { NestFactory } from '@nestjs/core';

import { WebModule } from './projects/web/web.module';
import { TrackerModule } from './projects/tracker/tracker.module';

async function bootstrap() {
  const web = await NestFactory.create(WebModule);
  await web.listen(8000);

  const app = await NestFactory.create(TrackerModule, { cors: true });
  await app.listen(8001);
}
bootstrap();
