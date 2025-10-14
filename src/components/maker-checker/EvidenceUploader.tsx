import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Upload, File, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EvidenceUploaderProps {
  onFilesUploaded: (urls: string[]) => void;
  existingFiles?: string[];
  maxFiles?: number;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  onFilesUploaded,
  existingFiles = [],
  maxFiles = 5
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = files.length + existingFiles.length + selectedFiles.length;
    
    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `evidence/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('esms-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('esms-documents')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      onFilesUploaded(uploadedUrls);
      setFiles([]);
      toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Supporting Evidence</CardTitle>
        <CardDescription>
          Upload documents, images, or other files to support your submission (Max {maxFiles} files)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Files */}
        {existingFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Existing Evidence</Label>
            <div className="space-y-2">
              {existingFiles.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded bg-muted/50">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{url.split('/').pop()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="evidence-upload">Add New Files</Label>
          <div className="flex items-center gap-2">
            <Input
              id="evidence-upload"
              type="file"
              multiple
              onChange={handleFileSelect}
              disabled={uploading || (files.length + existingFiles.length) >= maxFiles}
              className="cursor-pointer"
            />
            <Button
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading}
              size="sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* Selected Files List */}
        {files.length > 0 && !uploading && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Files to Upload</Label>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <File className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
