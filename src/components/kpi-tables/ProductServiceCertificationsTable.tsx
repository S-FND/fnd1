import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Award, Link2, ExternalLink, Lightbulb, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CellNumberBadge } from './CellNumberBadge';

interface Award {
  id: string;
  title: string;
  year: string;
  description: string;
}

interface MediaMention {
  id: string;
  title: string;
  source: string;
  link: string;
  date: string;
}

interface Initiative {
  id: string;
  backgroundAndProblem: string;
  impactAndOutcomes: string;
  challengesAndLessons: string;
  futurePlansAndScalability: string;
}

interface ProductServiceCertificationsTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string | number | boolean) => void;
  readOnly?: boolean;
}

export const ProductServiceCertificationsTable = ({ 
  formData, 
  onInputChange,
  readOnly = false 
}: ProductServiceCertificationsTableProps) => {
  // Parse existing awards from formData
  const getAwards = (): Award[] => {
    const stored = formData['founder_awards_list'];
    if (typeof stored === 'string' && stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Parse existing media mentions from formData
  const getMediaMentions = (): MediaMention[] => {
    const stored = formData['media_mentions_list'];
    if (typeof stored === 'string' && stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Parse existing initiatives from formData
  const getInitiatives = (): Initiative[] => {
    const stored = formData['other_initiatives_list'];
    if (typeof stored === 'string' && stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const [awards, setAwards] = useState<Award[]>(getAwards);
  const [mediaMentions, setMediaMentions] = useState<MediaMention[]>(getMediaMentions);
  const [initiatives, setInitiatives] = useState<Initiative[]>(getInitiatives);

  // Award functions
  const addAward = () => {
    const newAward: Award = {
      id: crypto.randomUUID(),
      title: '',
      year: new Date().getFullYear().toString(),
      description: '',
    };
    const updated = [...awards, newAward];
    setAwards(updated);
    onInputChange('founder_awards_list', JSON.stringify(updated));
  };

  const updateAward = (id: string, field: keyof Award, value: string) => {
    const updated = awards.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    setAwards(updated);
    onInputChange('founder_awards_list', JSON.stringify(updated));
  };

  const removeAward = (id: string) => {
    const updated = awards.filter(a => a.id !== id);
    setAwards(updated);
    onInputChange('founder_awards_list', JSON.stringify(updated));
  };

  // Media mention functions
  const addMediaMention = () => {
    const newMention: MediaMention = {
      id: crypto.randomUUID(),
      title: '',
      source: '',
      link: '',
      date: '',
    };
    const updated = [...mediaMentions, newMention];
    setMediaMentions(updated);
    onInputChange('media_mentions_list', JSON.stringify(updated));
  };

  const updateMediaMention = (id: string, field: keyof MediaMention, value: string) => {
    const updated = mediaMentions.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setMediaMentions(updated);
    onInputChange('media_mentions_list', JSON.stringify(updated));
  };

  const removeMediaMention = (id: string) => {
    const updated = mediaMentions.filter(m => m.id !== id);
    setMediaMentions(updated);
    onInputChange('media_mentions_list', JSON.stringify(updated));
  };

  // Initiative functions
  const addInitiative = () => {
    const newInitiative: Initiative = {
      id: crypto.randomUUID(),
      backgroundAndProblem: '',
      impactAndOutcomes: '',
      challengesAndLessons: '',
      futurePlansAndScalability: '',
    };
    const updated = [...initiatives, newInitiative];
    setInitiatives(updated);
    onInputChange('other_initiatives_list', JSON.stringify(updated));
  };

  const updateInitiative = (id: string, field: keyof Initiative, value: string) => {
    const updated = initiatives.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    );
    setInitiatives(updated);
    onInputChange('other_initiatives_list', JSON.stringify(updated));
  };

  const removeInitiative = (id: string) => {
    const updated = initiatives.filter(i => i.id !== id);
    setInitiatives(updated);
    onInputChange('other_initiatives_list', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Founder Awards and Recognitions */}
      <Card>
        <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
            <CellNumberBadge kpiNumber={1} />
            <Award className="h-5 w-5 text-amber-500" />
            Awards and Recognitions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add awards and recognitions received by the founders or the company.
            </p>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAward}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Award
              </Button>
            )}
          </div>

          {awards.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4 text-center border rounded-lg bg-muted/20">
              No awards added yet. Click "Add Award" to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {awards.map((award, index) => (
                <div 
                  key={award.id} 
                  className="p-4 border rounded-lg bg-muted/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Award #{index + 1}
                    </span>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAward(award.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`award-title-${award.id}`}>Award Title</Label>
                      <Input
                        id={`award-title-${award.id}`}
                        value={award.title}
                        onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                        placeholder="e.g., Best Startup Award"
                        disabled={readOnly}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`award-year-${award.id}`}>Year</Label>
                      <Input
                        id={`award-year-${award.id}`}
                        value={award.year}
                        onChange={(e) => updateAward(award.id, 'year', e.target.value)}
                        placeholder="2024"
                        disabled={readOnly}
                        className="max-w-[120px]"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`award-desc-${award.id}`}>Description</Label>
                      <Textarea
                        id={`award-desc-${award.id}`}
                        value={award.description}
                        onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                        placeholder="Brief description of the award..."
                        disabled={readOnly}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && awards.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAward}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Significant Media Mentions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CellNumberBadge kpiNumber={2} />
            <Link2 className="h-5 w-5 text-blue-500" />
            Significant Media Mentions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add notable media coverage and mentions. Include links to the articles.
            </p>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMediaMention}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Media Mention
              </Button>
            )}
          </div>

          {mediaMentions.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4 text-center border rounded-lg bg-muted/20">
              No media mentions added yet. Click "Add Media Mention" to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {mediaMentions.map((mention, index) => (
                <div 
                  key={mention.id} 
                  className="p-4 border rounded-lg bg-muted/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Media Mention #{index + 1}
                    </span>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMediaMention(mention.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`mention-title-${mention.id}`}>Title</Label>
                      <Input
                        id={`mention-title-${mention.id}`}
                        value={mention.title}
                        onChange={(e) => updateMediaMention(mention.id, 'title', e.target.value)}
                        placeholder="Title of the mention"
                        disabled={readOnly}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`mention-source-${mention.id}`}>Source/Publication</Label>
                      <Input
                        id={`mention-source-${mention.id}`}
                        value={mention.source}
                        onChange={(e) => updateMediaMention(mention.id, 'source', e.target.value)}
                        placeholder="e.g., Economic Times, Forbes"
                        disabled={readOnly}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`mention-date-${mention.id}`}>Year</Label>
                      <Input
                        id={`mention-date-${mention.id}`}
                        type="text"
                        value={mention.date}
                        onChange={(e) => updateMediaMention(mention.id, 'date', e.target.value)}
                        placeholder="YYYY"
                        disabled={readOnly}
                        className="max-w-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`mention-link-${mention.id}`}>Relevant Link</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`mention-link-${mention.id}`}
                          type="url"
                          value={mention.link}
                          onChange={(e) => updateMediaMention(mention.id, 'link', e.target.value)}
                          placeholder="https://..."
                          disabled={readOnly}
                        />
                        {mention.link && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(mention.link, '_blank')}
                            className="shrink-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && mediaMentions.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMediaMention}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Any Other Initiatives Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CellNumberBadge kpiNumber={3} />
            <Lightbulb className="h-5 w-5 text-green-500" />
            Any Other Initiatives
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>If you have undertaken any impact specific initiatives which are not covered above, please mention here.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              If you have undertaken any impact specific initiatives which are not covered above, please mention here.
            </p>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInitiative}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Initiative
              </Button>
            )}
          </div>

          {initiatives.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4 text-center border rounded-lg bg-muted/20">
              No initiatives added yet. Click "Add Initiative" to add one.
            </p>
          ) : (
            <div className="space-y-6">
              {initiatives.map((initiative, index) => (
                <div 
                  key={initiative.id} 
                  className="p-4 border rounded-lg bg-muted/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Initiative #{index + 1}
                    </span>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInitiative(initiative.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* 1. Background and Problem */}
                    <div className="space-y-2">
                      <Label htmlFor={`initiative-background-${initiative.id}`} className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">1</span>
                        Background and Problem
                      </Label>
                      <p className="text-xs text-muted-foreground ml-7">
                        What was the unique problem you aimed to solve?
                      </p>
                      <Textarea
                        id={`initiative-background-${initiative.id}`}
                        value={initiative.backgroundAndProblem}
                        onChange={(e) => updateInitiative(initiative.id, 'backgroundAndProblem', e.target.value)}
                        placeholder="Describe the unique problem you aimed to solve..."
                        disabled={readOnly}
                        rows={3}
                        className="ml-0"
                      />
                    </div>

                    {/* 2. Impact & Outcomes */}
                    <div className="space-y-2">
                      <Label htmlFor={`initiative-impact-${initiative.id}`} className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">2</span>
                        Impact & Outcomes
                      </Label>
                      <p className="text-xs text-muted-foreground ml-7">
                        What is the impact - achieved or expected. What were the business benefits? Did it reduce costs, improve brand equity, or create operational efficiencies? (Add KPIs/numbers where possible)
                      </p>
                      <Textarea
                        id={`initiative-impact-${initiative.id}`}
                        value={initiative.impactAndOutcomes}
                        onChange={(e) => updateInitiative(initiative.id, 'impactAndOutcomes', e.target.value)}
                        placeholder="Describe the impact, outcomes, and business benefits with KPIs/numbers..."
                        disabled={readOnly}
                        rows={3}
                      />
                    </div>

                    {/* 3. Challenges & Lessons Learned */}
                    <div className="space-y-2">
                      <Label htmlFor={`initiative-challenges-${initiative.id}`} className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">3</span>
                        Challenges & Lessons Learned
                      </Label>
                      <Textarea
                        id={`initiative-challenges-${initiative.id}`}
                        value={initiative.challengesAndLessons}
                        onChange={(e) => updateInitiative(initiative.id, 'challengesAndLessons', e.target.value)}
                        placeholder="Describe the challenges faced and lessons learned..."
                        disabled={readOnly}
                        rows={3}
                      />
                    </div>

                    {/* 4. Future Plans & Scalability */}
                    <div className="space-y-2">
                      <Label htmlFor={`initiative-future-${initiative.id}`} className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">4</span>
                        Future Plans & Scalability
                      </Label>
                      <Textarea
                        id={`initiative-future-${initiative.id}`}
                        value={initiative.futurePlansAndScalability}
                        onChange={(e) => updateInitiative(initiative.id, 'futurePlansAndScalability', e.target.value)}
                        placeholder="Describe future plans and scalability potential..."
                        disabled={readOnly}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!readOnly && initiatives.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInitiative}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};