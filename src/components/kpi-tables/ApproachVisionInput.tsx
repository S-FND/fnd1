import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, Link, Upload, FileText, X, Info } from 'lucide-react';

interface ApproachVisionInputProps {
  label: string;
  textareaValue: string;
  onTextareaChange: (value: string) => void;
  weblinks: string[];
  onWeblinksChange: (links: string[]) => void;
  documents: string[];
  onDocumentsChange: (docs: string[]) => void;
  maxWords?: number;
  readOnly?: boolean;
  tooltip?: string;
}

export const ApproachVisionInput = ({
  label,
  textareaValue,
  onTextareaChange,
  weblinks,
  onWeblinksChange,
  documents,
  onDocumentsChange,
  maxWords = 300,
  readOnly = false,
  tooltip,
}: ApproachVisionInputProps) => {
  const [newLink, setNewLink] = useState('');

  const handleAddWeblink = () => {
    if (newLink.trim()) {
      onWeblinksChange([...weblinks, newLink.trim()]);
      setNewLink('');
    }
  };

  const handleRemoveWeblink = (index: number) => {
    const updated = weblinks.filter((_, i) => i !== index);
    onWeblinksChange(updated);
  };

  const handleWeblinkChange = (index: number, value: string) => {
    const updated = [...weblinks];
    updated[index] = value;
    onWeblinksChange(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map(f => f.name);
      onDocumentsChange([...documents, ...newDocs]);
    }
    e.target.value = ''; // Reset input
  };

  const handleRemoveDocument = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    onDocumentsChange(updated);
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(textareaValue);

  return (
    <div className="space-y-4 py-3">
      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{label}</label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-sm">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Textarea
          placeholder={`Enter details (max ${maxWords} words)...`}
          value={textareaValue}
          onChange={(e) => onTextareaChange(e.target.value)}
          className="min-h-[120px] text-sm"
          disabled={readOnly}
        />
        <p className={`text-xs ${wordCount > maxWords ? 'text-destructive' : 'text-muted-foreground'}`}>
          {wordCount}/{maxWords} words
        </p>
      </div>

      {/* Weblinks Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Web Links</span>
        </div>
        
        {weblinks.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={link}
              onChange={(e) => handleWeblinkChange(index, e.target.value)}
              className="flex-1 h-9 text-sm"
              disabled={readOnly}
            />
            {!readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive"
                onClick={() => handleRemoveWeblink(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        
        {!readOnly && (
          <div className="flex items-center gap-2">
            <Input
              type="url"
              placeholder="Add new link..."
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="flex-1 h-9 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddWeblink();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddWeblink}
              disabled={!newLink.trim()}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </Button>
          </div>
        )}
      </div>

      {/* Documents Upload Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Documents & Reports</span>
        </div>
        
        {documents.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
              >
                <FileText className="w-3 h-3" />
                <span className="max-w-[200px] truncate">{doc}</span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(index)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!readOnly && (
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="inline-flex items-center gap-2 px-3 py-2 border border-dashed rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Upload className="w-4 h-4" />
                Upload more documents
              </div>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Supported: PDF, Word, Excel, PowerPoint
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
