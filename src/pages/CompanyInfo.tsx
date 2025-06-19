import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';

interface CompanyFormData {
  companyName: string;
  legalName: string;
  email: string;
  phone: string;
  pan: string;
  gst: string;
  cin: string;
  incorporationDate: string;
  industry: string;
  address: string;
  website?: string;
  esgContactEmail?: string;
}

export default function CompanyInfo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyFormData>();

  const getCompanyInfo = async () => {
    try {
      const res = await fetch(`http://localhost:3002/company/entity/`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch company info");
      
      const jsonData = await res.json();

      if (jsonData.data) {
        setFormData({
          companyName: jsonData.data.companyName,
          legalName: jsonData.data.legalName || "N/A",
          email: jsonData.data.email,
          phone: jsonData.data.phone,
          pan: jsonData.data.panNumber,
          gst: jsonData.data.gstNumber,
          cin: jsonData.data.cin || "N/A",
          incorporationDate: jsonData.data.incorporationDate || "N/A",
          industry: jsonData.data.industry || "N/A",
          address: jsonData.data.address,
          website: jsonData.data.website,
          esgContactEmail: jsonData.data.esgContactEmail
        });
      }
    } catch (error) {
      console.error("API call failed:", error);
      // Optionally show error toast
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <UnifiedSidebarLayout>
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Company Information</h2>
        <Button onClick={() => navigate("/company-info/edit")}>
          Edit Company Profile
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-[200px]">Company Name</TableCell>
                <TableCell>{formData?.companyName || "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Legal Name</TableCell>
                <TableCell>{formData?.legalName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>{formData?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Phone</TableCell>
                <TableCell>{formData?.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">PAN</TableCell>
                <TableCell>{formData?.pan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GST</TableCell>
                <TableCell>{formData?.gst}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CIN</TableCell>
                <TableCell>{formData?.cin}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Incorporation Date</TableCell>
                <TableCell>{formData?.incorporationDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Industry</TableCell>
                <TableCell>{formData?.industry}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Address</TableCell>
                <TableCell>{formData?.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Website</TableCell>
                <TableCell>
                  {formData?.website ? (
                    <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {formData.website}
                    </a>
                  ) : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ESG Contact Email</TableCell>
                <TableCell>{formData?.esgContactEmail || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </UnifiedSidebarLayout>
  );
}