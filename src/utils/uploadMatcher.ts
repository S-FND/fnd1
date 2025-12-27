import { SignedUploadUrl } from "./parallelUploader";


export function findSignedUrlForFile(
  file: File,
  signedUrls: SignedUploadUrl[]
): SignedUploadUrl | undefined {
  // backend guarantees filename is preserved at the end
  return signedUrls.find(signed =>
    signed.name.endsWith(file.name)
  );
}