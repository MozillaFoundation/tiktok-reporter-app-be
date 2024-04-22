import { SignedUrlDto } from '../dtos/signedUrl.dto';

export function mapUrlToDto(url: string): SignedUrlDto {
  return {
    url: url.replace(
      'https://storage.googleapis.com/ttreporer_recordings/',
      '',
    ),
  } as SignedUrlDto;
}
