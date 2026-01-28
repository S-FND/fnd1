export const getS3FilePath = (file_path: string) => {
  if (!file_path) return "";
  // If backend already sends full URL
  if (file_path.startsWith("http://") || file_path.startsWith("https://")) {
    return encodeURI(file_path);
  }

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_S3_REGION || "ap-south-1";
  const cloudfrontUrl = import.meta.env.VITE_S3_CLOUDFRONT_URL;

  // Prefer CloudFront
  if (cloudfrontUrl) {
    return encodeURI(`${cloudfrontUrl}/${file_path}`);
  }

  if (!bucketName) {
    console.error("VITE_S3_BUCKET_NAME is not configured");
    return "";
  }

  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${file_path}`;
  console.log("S3 fallback URL:", s3Url);

  return encodeURI(s3Url);
};

export const extractS3Key = (url: string) => {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.replace(/^\/+/, ""));
  } catch {
    return url;
  }
};
