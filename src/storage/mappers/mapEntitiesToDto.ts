import { StorageFileDto } from '../dtos/storage-file.dto';

export function mapFileToDto(file: any): StorageFileDto {
  if (!file) {
    return null;
  }
  const { bucket, id, name } = file;
  const storageUrl = `https://storage.cloud.google.com/${bucket.name}/${id}`;

  return {
    id: id,
    name: name,
    bucketName: bucket.name,
    storageUrl,
  };
}
