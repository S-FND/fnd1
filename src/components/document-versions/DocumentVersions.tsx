import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDocumentVersions, DocumentVersion } from '@/hooks/useActionLog';
import { formatDistanceToNow } from 'date-fns';
import { History, Download, Eye, Crown } from 'lucide-react';

interface DocumentVersionsProps {
  documentId: string;
  documentTitle: string;
}

export function DocumentVersions({ documentId, documentTitle }: DocumentVersionsProps) {
  const { versions, loading } = useDocumentVersions(documentId);

  const handleDownload = (version: DocumentVersion) => {
    if (version.file_url) {
      window.open(version.file_url, '_blank');
    }
  };

  const handleView = (version: DocumentVersion) => {
    // Implement view logic based on content type
    console.log('View version:', version);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Version History - {documentTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No versions found for this document
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 border rounded-lg ${
                  version.is_current ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={version.is_current ? 'default' : 'secondary'}>
                        v{version.version_number}
                      </Badge>
                      {version.is_current && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Crown className="h-3 w-3 mr-1" />
                          Current
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <h4 className="font-medium">{version.title}</h4>
                    
                    {version.change_summary && (
                      <p className="text-sm text-muted-foreground">{version.change_summary}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {version.file_size && (
                        <span>Size: {(version.file_size / 1024).toFixed(1)} KB</span>
                      )}
                      {version.mime_type && (
                        <span>Type: {version.mime_type}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(version)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {version.file_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(version)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}