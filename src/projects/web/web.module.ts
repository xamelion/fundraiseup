import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'assets'),
      serveStaticOptions: {
        index: 'main.html',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class WebModule {}
