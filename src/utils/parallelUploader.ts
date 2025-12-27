// import { SignedUploadUrl } from "@/types/upload";
import { findSignedUrlForFile } from "./uploadMatcher";
import { uploadFileWithProgress } from "./uploadWithProgress";


export type SignedUploadUrl = {
  name: string; // e.g. "Apr-2025/emergency_qr.png"
  url: string;  // signed PUT URL
};

type UploadTask = {
  key: string;
  file: File;
  signed: SignedUploadUrl;
};

export async function uploadFilesInParallel(
  entryKey: string,
  files: File[],
  signedUrls: SignedUploadUrl[],
  concurrency: number,
  onProgress: (key: string, percent: number) => void,
  onStatus: (key: string, status: "uploading" | "done" | "error") => void
) {
  const tasks: UploadTask[] = files
    .map(file => {
      const signed = findSignedUrlForFile(file, signedUrls);
      if (!signed) return null;

      return {
        key: `${entryKey}-${file.name}`,
        file,
        signed,
      };
    })
    .filter(Boolean) as UploadTask[];

  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const task = tasks[index++];
      onStatus(task.key, "uploading");

      try {
        await uploadFileWithProgress(task.file, task.signed.url, percent =>
          onProgress(task.key, percent)
        );
        onStatus(task.key, "done");
      } catch {
        onStatus(task.key, "error");
      }
    }
  }

  const workers = Array.from({ length: concurrency }, worker);
  await Promise.all(workers);
}
