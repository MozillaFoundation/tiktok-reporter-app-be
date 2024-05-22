import { StorageOptions } from '@google-cloud/storage';

const storageConfig: StorageOptions = {
  projectId: process.env.GCS_PROJECT_ID,
};

// In production, credentials are not required, using IAM.
if (process.env.NODE_ENV !== 'production') {
  storageConfig.credentials = {
    client_email: process.env.GCS_STORAGE_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
}

export const mediaBucket = process.env.GCS_STORAGE_BUCKET;
export default storageConfig;
