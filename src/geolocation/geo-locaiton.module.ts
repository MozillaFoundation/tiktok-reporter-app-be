import { GeolocationService } from './geo-location.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
