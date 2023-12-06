const StorageConfig = {
  projectId: process.env.GCS_PROJECT_ID,
  private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GCS_STORAGE_CLIENT_EMAIL,
  mediaBucket: process.env.GCS_STORAGE_BUCKET,
};

export default StorageConfig;
