import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, XCircle, FileText, BarChart3, Flame, Shield, Target, Building2, Calendar, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { get } from 'http';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { toast } from 'sonner';

// Mock data for different modules - in production this would come from the database
const getApprovalItemDetails = (id: string, module: string) => {
    // GHG Activity Data
    if (module === 'ghg' || module === 'GHG') {
        return {
            module: 'GHG Accounting',
            moduleIcon: Flame,
            title: 'Diesel Generator - January 2024',
            description: 'Activity data submission for GHG Scope 1 emissions',
            submittedBy: 'Rajesh Kumar',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            facility: 'Mumbai Plant',
            scope: 'Scope 1',
            category: 'Stationary Combustion',
            priority: 'high',
            status: 'submitted',
            dataFields: [
                { label: 'Source Name', value: 'Diesel Generator', previousValue: null },
                { label: 'Activity Value', value: '2,450 liters', previousValue: '2,100 liters' },
                { label: 'Activity Unit', value: 'Liters', previousValue: null },
                { label: 'Emission Factor', value: '2.67 kg CO2e/liter', previousValue: null },
                { label: 'Calculated Emissions', value: '6.54 tCO2e', previousValue: '5.61 tCO2e' },
                { label: 'Reporting Period', value: 'January 2024', previousValue: null },
                { label: 'Data Source', value: 'Fuel Purchase Records', previousValue: null },
                { label: 'Evidence', value: 'Invoice_Jan2024.pdf', previousValue: null },
            ],
        };
    }

    // ESG Metrics Data
    if (module === 'esg' || module === 'ESG Metrics' || module === 'esg_metrics') {
        return {
            module: 'ESG Metrics',
            moduleIcon: BarChart3,
            title: 'Water Consumption Report',
            description: 'Q1 2024 water usage data for all facilities',
            submittedBy: 'Vikram Singh',
            submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            facility: 'All Facilities',
            category: 'Environmental',
            priority: 'medium',
            status: 'pending_review',
            dataFields: [
                { label: 'Metric Name', value: 'Total Water Consumption', previousValue: null },
                { label: 'Metric Value', value: '125,000 m³', previousValue: '118,500 m³' },
                { label: 'Unit', value: 'Cubic meters (m³)', previousValue: null },
                { label: 'Reporting Period', value: 'Q1 2024', previousValue: null },
                { label: 'Data Source', value: 'Water Bills & Meter Readings', previousValue: null },
                { label: 'Calculation Method', value: 'Direct Measurement', previousValue: null },
                { label: 'YoY Change', value: '+5.5%', previousValue: null },
            ],
        };
    }

    // ESMS Policy Document
    if (module === 'esms' || module === 'ESMS') {
        return {
            module: 'ESMS',
            moduleIcon: FileText,
            title: 'Environmental Policy Document',
            description: 'Updated environmental management policy v2.1',
            submittedBy: 'Karthik Iyer',
            submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Policy',
            priority: 'medium',
            status: 'pending_review',
            dataFields: [
                { label: 'Document Title', value: 'Environmental Management Policy', previousValue: null },
                { label: 'Version', value: 'v2.1', previousValue: 'v2.0' },
                { label: 'Document Type', value: 'Policy', previousValue: null },
                { label: 'Section', value: 'Environmental Management', previousValue: null },
                { label: 'Last Updated', value: format(new Date(), 'MMM d, yyyy'), previousValue: null },
                { label: 'File Name', value: 'Environmental_Policy_v2.1.pdf', previousValue: 'Environmental_Policy_v2.0.pdf' },
                { label: 'File Size', value: '2.4 MB', previousValue: '2.1 MB' },
                { label: 'Changes', value: 'Updated climate commitments section, added net-zero targets', previousValue: null },
            ],
        };
    }

    // SDG Metrics
    if (module === 'sdg' || module === 'SDG Metrics') {
        return {
            module: 'SDG Metrics',
            moduleIcon: Target,
            title: 'SDG 13 - Climate Action Progress',
            description: 'Annual climate action metrics and targets',
            submittedBy: 'Arjun Menon',
            submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'SDG Reporting',
            priority: 'medium',
            status: 'pending_review',
            dataFields: [
                { label: 'SDG Goal', value: 'SDG 13 - Climate Action', previousValue: null },
                { label: 'Target', value: '13.2 - Integrate climate measures', previousValue: null },
                { label: 'Indicator', value: 'GHG Emissions Reduction %', previousValue: null },
                { label: 'Current Value', value: '12% reduction', previousValue: '8% reduction' },
                { label: 'Target Value', value: '25% reduction by 2025', previousValue: null },
                { label: 'Baseline Year', value: '2020', previousValue: null },
                { label: 'Reporting Period', value: 'FY 2023-24', previousValue: null },
            ],
        };
    }

    // ESG Due Diligence
    if (module === 'esg_dd' || module === 'ESG DD') {
        return {
            module: 'ESG Due Diligence',
            moduleIcon: Shield,
            title: 'Supplier ESG Assessment - ABC Corp',
            description: 'Due diligence assessment for new supplier',
            submittedBy: 'Meera Nair',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Due Diligence',
            priority: 'critical',
            status: 'pending_review',
            dataFields: [
                { label: 'Company Name', value: 'ABC Corporation', previousValue: null },
                { label: 'Assessment Type', value: 'New Supplier Due Diligence', previousValue: null },
                { label: 'Risk Score', value: 'Medium (45/100)', previousValue: null },
                { label: 'Environmental Risk', value: 'Low', previousValue: null },
                { label: 'Social Risk', value: 'Medium', previousValue: null },
                { label: 'Governance Risk', value: 'Low', previousValue: null },
                { label: 'Recommendation', value: 'Approve with conditions', previousValue: null },
                { label: 'Conditions', value: 'Annual ESG reporting required', previousValue: null },
            ],
        };
    }

    // Default fallback
    return {
        module: 'Unknown',
        moduleIcon: FileText,
        title: 'Approval Item',
        description: 'Data pending review',
        submittedBy: 'Unknown',
        submittedAt: new Date().toISOString(),
        category: 'General',
        priority: 'medium',
        status: 'pending_review',
        dataFields: [
            { label: 'Item ID', value: id, previousValue: null },
            { label: 'Status', value: 'Pending Review', previousValue: null },
        ],
    };
};
export interface EvidenceFile {
    key?: string;
    type?: string;
    name?: string;
}

export interface GHGCollectedData {
    _id: string;
    entityId: string;
    sourceTemplateId: string;

    reportingPeriod: string;
    reportingMonth: string;
    reportingYear: number;

    activityDataValue: number;

    emissionCO2: number;
    emissionCH4: number;
    emissionN2O: number;
    totalEmission: number;

    dataQuality: 'Low' | 'Medium' | 'High';

    collectedDate: string; // YYYY-MM-DD
    collectedBy: string;

    verifiedBy: string;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';

    notes: string;

    evidenceFiles: EvidenceFile[];

    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface user {
    _id: string;
    name: string;
    email: string;
}


export interface GHGTemplateDetails {
    _id: string;
    entityId: string;

    facilityName: string;
    businessUnit: string;

    sourceCategory: string;
    sourceDescription: string;
    sourceType: string;

    fuelSubstanceType: string;

    emissionFactorId: string;
    emissionFactor: number;
    emissionFactorUnit: string;
    emissionFactorSource: string;

    activityDataUnit: string;
    measurementFrequency: 'Monthly' | 'Quarterly' | 'Yearly';

    assignedDataCollectors: string[];
    assignedVerifiers: string[];

    ghgIncluded: string;
    calculationMethodology: string;
    dataSource: string;

    isActive: boolean;


    notes: string;

    createdAt: string;
    updatedAt: string;
    __v: number;
    collectors: user[];
    verifiers: user[]
}


export interface GHGCollectedDataResponse {
    collectedData: GHGCollectedData[];
    templateDetails: GHGTemplateDetails;
}

const VerifierApprovalDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();


    const [params] = useSearchParams();
    const collectionId = params.get('collectionId');
    const scopeName = params.get('scope');


    const navigate = useNavigate();
    const module = searchParams.get('module') || 'ghg';
    const title = searchParams.get('title');
    const details = getApprovalItemDetails(id || '', module);
    const ModuleIcon = details.moduleIcon;

    let [itemDetails, setItemDetails] = React.useState<GHGCollectedDataResponse | null>(null);

    // Use title from URL if available
    const displayTitle = title || details.title;

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical':
                return <Badge className="bg-red-500 text-white">Critical</Badge>;
            case 'high':
                return <Badge className="bg-orange-500 text-white">High</Badge>;
            case 'medium':
                return <Badge variant="secondary">Medium</Badge>;
            case 'low':
                return <Badge variant="outline">Low</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted':
                return <Badge className="bg-blue-500 text-white">Submitted</Badge>;
            case 'pending_review':
                return <Badge className="bg-yellow-500 text-white">Pending Review</Badge>;
            case 'approved':
                return <Badge className="bg-green-500 text-white">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-500 text-white">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTempApprovalItemDetails = async (id: string, collectionId: string, module: string) => {
        // In a real application, fetch the details from an API based on id and module
        // Here we use mock data for demonstration
        try {
            let details: { status: number; data: GHGCollectedDataResponse } = await httpClient.get(`ghg-accounting/${id}/ghg-data-collection?id=${collectionId}`);
            logger.debug('Approval Item Details:', details);
            if (details.status == 200) {
                setItemDetails(details.data)
            }
            return details;
        } catch (error) {

        }
    };

    const handleApproveWithComment = async (itemId: string, dataCollectionId: string, comment: string) => {
        try {


            let approveDataResult = await httpClient.post('ghg-accounting/verify-ghg-data', {
                dataCollectionId: dataCollectionId,
                verificationStatus: 'Verified',
                verificationComments: comment,
            });
            if (approveDataResult.status !== 200) {
                throw new Error('Failed to approve GHG activity data');
            }
            else {
                getTempApprovalItemDetails(id || '', collectionId || '', module);
                toast.success('Approved successfully');
                navigate('/verifier-approvals')
            }




        } catch (error: any) {
            toast.error(error.message || 'Failed to approve');
            throw error;
        }
    };


    const handleRejectWithComment = async (itemId: string, dataCollectionId: string, comment: string) => {
        try {

            let approveDataResult = await httpClient.post('ghg-accounting/verify-ghg-data', {
                dataCollectionId: dataCollectionId,
                verificationStatus: 'Rejected',
                verificationComments: comment,
            });
            if (approveDataResult.status !== 200) {
                throw new Error('Failed to approve GHG activity data');
            }
            else {
                getTempApprovalItemDetails(id || '', collectionId || '', module);
                toast.success('Rejected successfully');
                navigate('/verifier-approvals')
            }


        } catch (error: any) {
            toast.error(error.message || 'Failed to reject');
            throw error;
        }
    };

    useEffect(() => {
        if (!id) {
            navigate('/verifier-approvals');
        }
        getTempApprovalItemDetails(id || '', collectionId || '', module);
    }, [id, collectionId, module]);

    useEffect(() => {
        console.log('itemDetails', itemDetails)
    }, [itemDetails])

    const getPriorityFromDataQuality = (quality?: string) => {
        switch (quality?.toLowerCase()) {
            case 'low':
                return 'low';
            case 'medium':
                return 'medium';
            case 'high':
                return 'high';
            default:
                return 'medium';
        }
    };

    const getStatusFromVerification = (status?: string) => {
        switch (status) {
            case 'Pending':
                return 'pending_review';
            case 'Verified':
                return 'approved';
            case 'Rejected':
                return 'rejected';
            default:
                return 'submitted';
        }
    };
    const selectedCollectedData = React.useMemo(() => {
        if (!itemDetails?.collectedData?.length || !collectionId) return null;
      
        return itemDetails.collectedData.find(
          d => d._id === collectionId
        ) || null;
      }, [itemDetails, collectionId]);
      selectedCollectedData
    return (
        <UnifiedSidebarLayout>
            <div className="container mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/verifier-approvals')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Approvals
                    </Button>
                </div>

                {/* Main Card */}
                {itemDetails && <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Flame className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{itemDetails?.templateDetails?.sourceType}, {itemDetails?.collectedData[0]['reportingMonth']} {itemDetails?.collectedData[0]['reportingYear']}</CardTitle>
                                    <CardDescription>{itemDetails.templateDetails.sourceDescription}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {getPriorityBadge(
                                    getPriorityFromDataQuality(
                                        selectedCollectedData?.dataQuality
                                    )
                                )}

                                {getStatusBadge(
                                    getStatusFromVerification(
                                        selectedCollectedData?.verificationStatus
                                    )
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Module</p>
                                    <p className="text-sm font-medium">{details.module}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Submitted By</p>
                                    <p className="text-sm font-medium">{itemDetails.templateDetails.collectors[0]['name']}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Submitted On</p>
                                    <p className="text-sm font-medium">{format(new Date(selectedCollectedData['updatedAt']), 'MMM d, yyyy')}</p>
                                </div>
                            </div>
                            {details.facility && (
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Facility</p>
                                        <p className="text-sm font-medium">{itemDetails.templateDetails.facilityName}</p>
                                    </div>
                                </div>
                            )}
                            {details.scope && (
                                <div className="flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Scope</p>
                                        <p className="text-sm font-medium">{scopeName.split('_').join(" ")}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Category</p>
                                    <p className="text-sm font-medium">{itemDetails.templateDetails.sourceCategory}</p>
                                </div>
                            </div>
                        </div>

                        {/* Data Change Table */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Data Changes for Review</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Field</TableHead>
                                        <TableHead>Current Value</TableHead>
                                        <TableHead>Previous Value</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* {details.dataFields.map((field, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{field.label}</TableCell>
                                            <TableCell>
                                                <span className={field.previousValue ? 'text-green-600 font-medium' : ''}>
                                                    {field.value}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {field.previousValue ? (
                                                    <span className="text-muted-foreground line-through">{field.previousValue}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {field.previousValue ? (
                                                    <Badge variant="outline" className="text-orange-600 border-orange-600">Changed</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Unchanged</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))} */}
                                    <TableRow key="entry">
                                        <TableCell className="font-medium">Activity Data Value</TableCell>
                                        <TableCell>
                                            {/* <span className={field.previousValue ? 'text-green-600 font-medium' : ''}>
                                                    {field.value}
                                                </span> */}
                                            <span className={true ? 'text-green-600 font-medium' : ''}>
                                                {itemDetails.collectedData[0]['activityDataValue']} {itemDetails.templateDetails.activityDataUnit}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {/* {field.previousValue ? (
                                                    <span className="text-muted-foreground line-through">{field.previousValue}</span>
                                                ) : ( */}
                                            <span className="text-muted-foreground">—</span>
                                            {/* )} */}
                                        </TableCell>
                                        <TableCell>
                                            {false ? (
                                                <Badge variant="outline" className="text-orange-600 border-orange-600">Changed</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground">Unchanged</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/verifier-approvals')}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleApproveWithComment(itemDetails.templateDetails._id, selectedCollectedData['_id'], 'Rejected')}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApproveWithComment(itemDetails.templateDetails._id, selectedCollectedData['_id'], 'Approved')}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                        </div>
                    </CardContent>
                </Card>}
            </div>
        </UnifiedSidebarLayout>
    );
};

export default VerifierApprovalDetailPage;