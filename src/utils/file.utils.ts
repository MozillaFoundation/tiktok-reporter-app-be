import { DEFAULT_MAX_FILE_SIZE } from './constants';

export function getFileExtension(fileName: string) {
  return fileName.split('/').pop();
}

export function getMaxFileSize() {
  return Number(
    process.env.GCS_FILE_SIZE_LIMIT_IN_BYTES || DEFAULT_MAX_FILE_SIZE,
  );
}
