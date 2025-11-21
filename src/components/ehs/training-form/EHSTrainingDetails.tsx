// src/components/ehs/training-form/EHSTrainingDetails.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Upload, Eye, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  User,
  Users,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { httpClient } from "@/lib/httpClient";

export interface Attendee {
  name: string;
  email?: string;
}

interface TrainingMaterial {
  id: string;
  name: string;
  type: 'manual' | 'slides' | 'resource';
  fileUrl?: string;
  externalUrl?: string;
  uploadedAt?: string;
}

// OLD structure (object with separate fields)
interface OldTrainingMaterials {
  manualFile?: string;
  manualLink?: string;
  slidesFile?: string;
  slidesLink?: string;
  resourcesFile?: string;
  resourcesLink?: string;
}

export interface TrainingDetails {
  id: string;
  name: string;
  description?: string;
  overview?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  startTime?: string;
  duration?: string;
  location?: string;
  status?: string;
  topics?: string[];
  attendees?: Attendee[];
  materials?: TrainingMaterial[] | OldTrainingMaterials; // Handle both structures
}

const EHSTrainingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [addMaterialModal, setAddMaterialModal] = React.useState({
    open: false,
    type: 'manual' as 'manual' | 'slides' | 'resource',
    name: '',
    file: null as File | null,
    url: ''
  });

  const fetchTraining = async (): Promise<TrainingDetails> => {
    const response = await httpClient.get(`ehs/trainings/${id}`);
    return response.data as TrainingDetails;
  };

  const { data: training, isLoading, isError, error } = useQuery<TrainingDetails>({
    queryKey: ["ehs-training", id],
    queryFn: fetchTraining,
    enabled: !!id,
  });

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusVariant = (status?: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending-approval":
      default:
        return "outline";
    }
  };

  // Get automatic name based on type
  const getMaterialName = (type: 'manual' | 'slides' | 'resource'): string => {
    switch (type) {
      case 'manual': return 'Training Manual';
      case 'slides': return 'Presentation Slides';
      case 'resource': return 'External Resource';
      default: return 'Training Material';
    }
  };

  // Convert old materials structure to new array structure
  const convertMaterialsToArray = (
    materials: TrainingMaterial[] | OldTrainingMaterials | undefined
  ): TrainingMaterial[] => {
    if (!materials) return [];

    if (Array.isArray(materials)) return materials;

    const types: ('manual' | 'slides' | 'resource')[] = ['manual', 'slides', 'resource'];
    const result: TrainingMaterial[] = [];

    types.forEach(type => {
      const fileKey = type === 'manual' ? 'manualFile' : type === 'slides' ? 'slidesFile' : 'resourcesFile';
      const linkKey = type === 'manual' ? 'manualLink' : type === 'slides' ? 'slidesLink' : 'resourcesLink';

      if ((materials as any)[fileKey] || (materials as any)[linkKey]) {
        result.push({
          id: `${type}-${Date.now()}`,
          type,
          name: getMaterialName(type),
          fileUrl: (materials as any)[fileKey],
          externalUrl: (materials as any)[linkKey],
          uploadedAt: new Date().toISOString()
        });
      }
    });

    return result;
  };


  // SINGLE function to add material (file or URL)
  const handleAddMaterial = async () => {
    if (!addMaterialModal.file && !addMaterialModal.url) {
      alert("Please either upload a file or provide a URL");
      return;
    }

    const materialName = sanitizeFileName(
      addMaterialModal.name.trim() || getMaterialName(addMaterialModal.type)
    );

    try {
      const formData = new FormData();
      formData.append("name", materialName);
      formData.append("type", addMaterialModal.type);

      if (addMaterialModal.file) formData.append("file", addMaterialModal.file);
      if (addMaterialModal.url) formData.append("url", addMaterialModal.url);

      const entityId = JSON.parse(localStorage.getItem('fandoro-user') || '{}').entityId;
      if (!entityId) {
        alert("Entity ID not found");
        return;
      }
      formData.append("entityId", entityId);

      // ✅ Find existing material of the same type
      const existingMaterial = materials.find(m => m.type === addMaterialModal.type);

      if (existingMaterial) {
        // ✅ DELETE the old one first
        await httpClient.delete(`ehs/trainings/${id}/materials/${existingMaterial._id}`);
      }

      // ✅ Then CREATE the new one
      await httpClient.post(`ehs/trainings/${id}/materials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      queryClient.invalidateQueries({ queryKey: ["ehs-training", id] });

      setAddMaterialModal({ open: false, type: 'manual', name: '', file: null, url: '' });
    } catch (error) {
      console.error("Failed to add material:", error);
      alert("Failed to add material. Please try again.");
    }
  };

  // SINGLE function to delete material
  const handleDeleteMaterial = async (material: TrainingMaterial) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      const entityId = JSON.parse(localStorage.getItem('fandoro-user') || '{}').entityId;
      if (!entityId) {
        alert("Entity ID not found");
        return;
      }

      if (material.isOldStructure) {
        const payload = {
          type: material.type,
          isFile: !!material.fileUrl, // true if it's a file URL, false if it's an external link
          entityId // pass entityId here
        };
        await httpClient.delete(`ehs/trainings/${id}/material-by-type`, { data: payload });
      } else {
        // New structure: delete by real ID
        await httpClient.delete(`ehs/trainings/${id}/materials/${material._id}`, {
          data: { entityId } // pass entityId here as well
        });
      }

      queryClient.invalidateQueries({ queryKey: ["ehs-training", id] });
    } catch (error) {
      console.error("Failed to delete material:", error);
      alert("Failed to delete material. Please try again.");
    }
  };


  // Update modal when type changes
  const handleTypeChange = (newType: 'manual' | 'slides' | 'resource') => {
    setAddMaterialModal(prev => ({
      ...prev,
      type: newType,
      name: prev.name || getMaterialName(newType)
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/ehs-trainings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trainings
          </Link>
        </Button>
        <p className="text-center text-lg mt-10">Loading training details...</p>
      </div>
    );
  }

  if (isError || !training) {
    return (
      <div className="p-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/ehs-trainings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trainings
          </Link>
        </Button>
        <p className="text-red-500 text-lg">
          {error instanceof Error ? error.message : "Unable to load training details."}
        </p>
      </div>
    );
  }

  const attendees: Attendee[] = training.attendees || [];

  // SAFELY convert materials to array format
  const materials: TrainingMaterial[] = convertMaterialsToArray(training.materials);

  // Group materials by type for better organization
  const manuals = materials.filter(m => m.type === 'manual');
  const slides = materials.filter(m => m.type === 'slides');
  const resources = materials.filter(m => m.type === 'resource');

  const MaterialSection = ({ title, materials, type }: {
    title: string;
    materials: TrainingMaterial[];
    type: 'manual' | 'slides' | 'resource'
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddMaterialModal({
            open: true,
            type,
            name: getMaterialName(type), // Auto-set name
            file: null,
            url: ''
          })}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {materials.length > 0 ? (
        <div className="space-y-2">
          {materials.map((material, index) => (
            <div key={material.id || `material-${index}`} className="flex items-center justify-between border p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                {material.type === 'manual' && <FileText className="h-5 w-5" />}
                {material.type === 'slides' && <FileText className="h-5 w-5" />}
                {material.type === 'resource' && <ExternalLink className="h-5 w-5" />}

                <div>
                  <p className="font-medium">{material.name}</p>
                  <p className="text-sm text-gray-500">
                    {material.fileUrl && material.externalUrl
                      ? 'File + External Link'
                      : material.fileUrl
                        ? 'File'
                        : material.externalUrl
                          ? 'External Link'
                          : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* File View Button */}
                {material.fileUrl && (
                  <a
                    href={getMaterialFileUrl(material.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4 cursor-pointer" title="View File" />
                  </a>
                )}

                {/* External URL Button */}
                {material.externalUrl && (
                  <a
                    href={material.externalUrl.startsWith('http') ? material.externalUrl : `https://${material.externalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 cursor-pointer" title="Visit Link" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 border rounded-lg">
          No {title.toLowerCase()} added yet
          <div className="flex items-center justify-center mt-2 space-x-2">
            <a
              href="https://lms.fandoro.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 cursor-pointer" />
            </a>
          </div>
        </div>
      )}
    </div>
  );

  const getMaterialFileUrl = (fileUrl?: string): string | undefined => {
    if (!fileUrl) return undefined;

    const S3_BASE_URL = "https://fandoro-sustainability-saas.s3.ap-south-1.amazonaws.com/"; // <-- replace with your bucket
    return fileUrl.startsWith("http") ? fileUrl : `${S3_BASE_URL}${fileUrl}`;
  };

  const sanitizeFileName = (fileName: string): string => {
    if (!fileName || typeof fileName !== 'string') return '';

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
      // No extension or just a dot at the end
      return fileName.replace(/\s+/g, '_').replace(/\./g, '_');
    }

    const namePart = fileName.substring(0, lastDotIndex).replace(/\s+/g, '_').replace(/\./g, '_');
    const extension = fileName.substring(lastDotIndex);
    return namePart + extension;
  };

  return (
    <div className="container mx-auto py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/ehs-trainings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trainings
        </Link>
      </Button>

      <Card className="space-y-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{training.name}</CardTitle>
              <CardDescription className="mt-1">
                {training.description || "Training details and overview."}
              </CardDescription>
            </div>

            {training.status && (
              <Badge variant={getStatusVariant(training.status)}>
                {training.status.replace("-", " ").toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(training.startDate || training.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>
                {training.startTime || "N/A"}{" "}
                {training.duration ? `(${training.duration})` : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{training.location || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{attendees.length} attendees</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-2">
              <h3 className="text-lg font-semibold">Training Overview</h3>
              <p>{training.overview || "General training information and safety topics."}</p>

              {training.topics?.length ? (
                <div className="mt-4">
                  <h4 className="font-semibold">Key Topics</h4>
                  <ul className="list-disc list-inside">
                    {training.topics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </TabsContent>

            {/* MATERIALS - SIMPLIFIED */}
            <TabsContent value="materials">
              <h3 className="text-lg font-semibold">Training Materials</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add training manuals, presentation slides, and external resources
              </p>

              <div className="space-y-6">
                <MaterialSection
                  title="Training Manuals"
                  materials={manuals}
                  type="manual"
                />

                <MaterialSection
                  title="Presentation Slides"
                  materials={slides}
                  type="slides"
                />

                <MaterialSection
                  title="External Resources"
                  materials={resources}
                  type="resource"
                />
              </div>
            </TabsContent>

            {/* Attendees */}
            <TabsContent value="attendees">
              <h3 className="text-lg font-semibold">Attendees</h3>
              <ul className="mt-3 space-y-2">
                {attendees.length ? (
                  attendees.map((a, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {a.name} {a.email ? `(${a.email})` : ""}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No attendees listed</li>
                )}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* SINGLE Add Material Modal */}
        <Dialog open={addMaterialModal.open} onOpenChange={(open) => setAddMaterialModal(prev => ({ ...prev, open }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add {getMaterialName(addMaterialModal.type)}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Material Type Selection */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={addMaterialModal.type === 'manual' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('manual')}
                  className="text-sm"
                >
                  Manual
                </Button>
                <Button
                  type="button"
                  variant={addMaterialModal.type === 'slides' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('slides')}
                  className="text-sm"
                >
                  Slides
                </Button>
                <Button
                  type="button"
                  variant={addMaterialModal.type === 'resource' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('resource')}
                  className="text-sm"
                >
                  Resource
                </Button>
              </div>

              {/* Material Name (Optional - Hidden since it's auto-generated) */}
              <div className="hidden">
                <Input
                  placeholder="Material name"
                  value={addMaterialModal.name}
                  onChange={(e) => setAddMaterialModal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* File Upload or URL Input */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${addMaterialModal.file ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                  onClick={() => document.getElementById('material-file')?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Upload File</p>
                  {addMaterialModal.file && (
                    <p className="text-xs text-green-600 mt-1 truncate">{addMaterialModal.file.name}</p>
                  )}
                </div>

                <div className={`border-2 rounded-lg p-4 ${addMaterialModal.url ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                  <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                  <Input
                    placeholder="https://lms.fandoro.com/"
                    value={addMaterialModal.url}
                    onChange={(e) => setAddMaterialModal(prev => ({ ...prev, url: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setAddMaterialModal({
                    open: false,
                    type: 'manual',
                    name: '',
                    file: null,
                    url: ''
                  })}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddMaterial}>
                  Add {getMaterialName(addMaterialModal.type)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* SINGLE Hidden File Input */}
        <input
          id="material-file"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const sanitizedFile = new File([file], sanitizeFileName(file.name), { type: file.type });
              setAddMaterialModal(prev => ({
                ...prev,
                file: sanitizedFile,
              }));
            }
          }}
        />
      </Card>
    </div>
  );
};

export default EHSTrainingDetails;