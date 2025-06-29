
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import OutsourcedServicesSection from './OutsourcedServicesSection';
import { OutsourcedService } from './types';

interface EmployeeData {
  function: string;
  permanentMale: string;
  permanentFemale: string;
  otherMale: string;
  otherFemale: string;
}

interface WorkerData {
  function: string;
  permanentMale: string;
  permanentFemale: string;
  otherMale: string;
  otherFemale: string;
}

interface DifferentlyAbledData {
  function: string;
  employedMale: string;
  employedFemale: string;
  contractMale: string;
  contractFemale: string;
}

const IRLHRInformation = () => {
  const [formData, setFormData] = useState({
    workingHours: '',
    shiftTiming: '',
    otHoursCurrent: '',
    otHoursPrevious: '',
    otPayCompensation: '',
    facilitiesList: '',
    productSafetyCertifications: '',
    emergencyIncidents: '',
    retrenchmentDetails: ''
  });

  const [outsourcedServices, setOutsourcedServices] = useState<OutsourcedService[]>([
    { agencyName: '', servicesDischarged: '', malePersons: '', femalePersons: '' }
  ]);

  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([
    { function: '', permanentMale: '', permanentFemale: '', otherMale: '', otherFemale: '' }
  ]);

  const [workerData, setWorkerData] = useState<WorkerData[]>([
    { function: '', permanentMale: '', permanentFemale: '', otherMale: '', otherFemale: '' }
  ]);

  const [differentlyAbledData, setDifferentlyAbledData] = useState<DifferentlyAbledData[]>([
    { function: '', employedMale: '', employedFemale: '', contractMale: '', contractFemale: '' }
  ]);

  const [boardDirectors, setBoardDirectors] = useState({
    male: '',
    female: '',
    total: ''
  });

  const [keyManagerial, setKeyManagerial] = useState({
    male: '',
    female: '',
    total: ''
  });

  // Auto-calculate totals for board directors and key managerial
  useEffect(() => {
    const boardTotal = (parseInt(boardDirectors.male) || 0) + (parseInt(boardDirectors.female) || 0);
    setBoardDirectors(prev => ({ ...prev, total: boardTotal.toString() }));
  }, [boardDirectors.male, boardDirectors.female]);

  useEffect(() => {
    const keyTotal = (parseInt(keyManagerial.male) || 0) + (parseInt(keyManagerial.female) || 0);
    setKeyManagerial(prev => ({ ...prev, total: keyTotal.toString() }));
  }, [keyManagerial.male, keyManagerial.female]);

  const addEmployeeRow = () => {
    setEmployeeData([...employeeData, { function: '', permanentMale: '', permanentFemale: '', otherMale: '', otherFemale: '' }]);
  };

  const addWorkerRow = () => {
    setWorkerData([...workerData, { function: '', permanentMale: '', permanentFemale: '', otherMale: '', otherFemale: '' }]);
  };

  const addDifferentlyAbledRow = () => {
    setDifferentlyAbledData([...differentlyAbledData, { function: '', employedMale: '', employedFemale: '', contractMale: '', contractFemale: '' }]);
  };

  const calculateEmployeeTotal = () => {
    const totals = {
      permanentMale: 0,
      permanentFemale: 0,
      otherMale: 0,
      otherFemale: 0
    };

    employeeData.forEach(emp => {
      totals.permanentMale += parseInt(emp.permanentMale) || 0;
      totals.permanentFemale += parseInt(emp.permanentFemale) || 0;
      totals.otherMale += parseInt(emp.otherMale) || 0;
      totals.otherFemale += parseInt(emp.otherFemale) || 0;
    });

    return totals;
  };

  const calculateWorkerTotal = () => {
    const totals = {
      permanentMale: 0,
      permanentFemale: 0,
      otherMale: 0,
      otherFemale: 0
    };

    workerData.forEach(worker => {
      totals.permanentMale += parseInt(worker.permanentMale) || 0;
      totals.permanentFemale += parseInt(worker.permanentFemale) || 0;
      totals.otherMale += parseInt(worker.otherMale) || 0;
      totals.otherFemale += parseInt(worker.otherFemale) || 0;
    });

    return totals;
  };

  const calculateDifferentlyAbledTotal = () => {
    const totals = {
      employedMale: 0,
      employedFemale: 0,
      contractMale: 0,
      contractFemale: 0
    };

    differentlyAbledData.forEach(data => {
      totals.employedMale += parseInt(data.employedMale) || 0;
      totals.employedFemale += parseInt(data.employedFemale) || 0;
      totals.contractMale += parseInt(data.contractMale) || 0;
      totals.contractFemale += parseInt(data.contractFemale) || 0;
    });

    return totals;
  };

  const handleSave = () => {
    console.log('Saving HR data:', { formData, outsourcedServices, employeeData, workerData, differentlyAbledData, boardDirectors, keyManagerial });
  };

  const handleSubmit = () => {
    console.log('Submitting HR data:', { formData, outsourcedServices, employeeData, workerData, differentlyAbledData, boardDirectors, keyManagerial });
  };

  const employeeTotals = calculateEmployeeTotal();
  const workerTotals = calculateWorkerTotal();
  const differentlyAbledTotals = calculateDifferentlyAbledTotal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Information</CardTitle>
        <CardDescription>
          Please provide comprehensive HR data for your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 1. Working hours for FTEs */}
        <div className="space-y-2">
          <Label htmlFor="workingHours">1. Working hours for FTEs</Label>
          <Input
            id="workingHours"
            value={formData.workingHours}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
          />
        </div>

        {/* 2. Shift timing for contract workers */}
        <div className="space-y-4">
          <Label>2. Shift timing for contract workers (if any)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shiftTiming">Shift timing</Label>
              <Input
                id="shiftTiming"
                value={formData.shiftTiming}
                onChange={(e) => setFormData({ ...formData, shiftTiming: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otHoursCurrent">Total OT hours - Current FY</Label>
              <Input
                id="otHoursCurrent"
                value={formData.otHoursCurrent}
                onChange={(e) => setFormData({ ...formData, otHoursCurrent: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otHoursPrevious">Total OT hours - Previous FY</Label>
              <Input
                id="otHoursPrevious"
                value={formData.otHoursPrevious}
                onChange={(e) => setFormData({ ...formData, otHoursPrevious: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otPayCompensation">Total OT Pay/Compensation</Label>
              <Input
                id="otPayCompensation"
                value={formData.otPayCompensation}
                onChange={(e) => setFormData({ ...formData, otPayCompensation: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 3. Outsourced Services */}
        <OutsourcedServicesSection 
          outsourcedServices={outsourcedServices} 
          setOutsourcedServices={setOutsourcedServices} 
        />

        {/* 4. List of major facilities */}
        <div className="space-y-2">
          <Label htmlFor="facilitiesList">4. List of major facilities/Units/Departments (Manufacturing, Laboratory, Cafeteria) provided by property owner in the office space (With number of each facility)</Label>
          <Textarea
            id="facilitiesList"
            value={formData.facilitiesList}
            onChange={(e) => setFormData({ ...formData, facilitiesList: e.target.value })}
          />
        </div>

        {/* 5. Product safety certifications */}
        <div className="space-y-2">
          <Label htmlFor="productSafetyCertifications">5. Certifications (if any) for product safety</Label>
          <Textarea
            id="productSafetyCertifications"
            value={formData.productSafetyCertifications}
            onChange={(e) => setFormData({ ...formData, productSafetyCertifications: e.target.value })}
          />
        </div>

        {/* 6. Emergency incidents */}
        <div className="space-y-2">
          <Label htmlFor="emergencyIncidents">6. Have the employees (on-roll, contract) been involved in any emergency incidents or accidents occurred in the workplace or during work related activities?</Label>
          <Textarea
            id="emergencyIncidents"
            value={formData.emergencyIncidents}
            onChange={(e) => setFormData({ ...formData, emergencyIncidents: e.target.value })}
          />
        </div>

        {/* 7. Human Resource Management - Employees */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">7. Human Resource Management - Employees</h3>
            <Button onClick={addEmployeeRow} size="sm">Add Row</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Function</th>
                  <th className="border border-gray-300 p-2 text-center" colSpan={2}>Permanent</th>
                  <th className="border border-gray-300 p-2 text-center" colSpan={2}>Other than Permanent</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2 text-center">Male</th>
                  <th className="border border-gray-300 p-2 text-center">Female</th>
                  <th className="border border-gray-300 p-2 text-center">Male</th>
                  <th className="border border-gray-300 p-2 text-center">Female</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <Input
                        value={employee.function}
                        onChange={(e) => {
                          const newData = [...employeeData];
                          newData[index].function = e.target.value;
                          setEmployeeData(newData);
                        }}
                        placeholder="Enter function"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={employee.permanentMale}
                        onChange={(e) => {
                          const newData = [...employeeData];
                          newData[index].permanentMale = e.target.value;
                          setEmployeeData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={employee.permanentFemale}
                        onChange={(e) => {
                          const newData = [...employeeData];
                          newData[index].permanentFemale = e.target.value;
                          setEmployeeData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={employee.otherMale}
                        onChange={(e) => {
                          const newData = [...employeeData];
                          newData[index].otherMale = e.target.value;
                          setEmployeeData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={employee.otherFemale}
                        onChange={(e) => {
                          const newData = [...employeeData];
                          newData[index].otherFemale = e.target.value;
                          setEmployeeData(newData);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 p-2">Total</td>
                  <td className="border border-gray-300 p-2 text-center">{employeeTotals.permanentMale}</td>
                  <td className="border border-gray-300 p-2 text-center">{employeeTotals.permanentFemale}</td>
                  <td className="border border-gray-300 p-2 text-center">{employeeTotals.otherMale}</td>
                  <td className="border border-gray-300 p-2 text-center">{employeeTotals.otherFemale}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Human Resource Management - Workers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">8. Human Resource Management - Workers</h3>
            <Button onClick={addWorkerRow} size="sm">Add Row</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Function</th>
                  <th className="border border-gray-300 p-2 text-center" colSpan={2}>Permanent</th>
                  <th className="border border-gray-300 p-2 text-center" colSpan={2}>Other than Permanent</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2 text-center">Male</th>
                  <th className="border border-gray-300 p-2 text-center">Female</th>
                  <th className="border border-gray-300 p-2 text-center">Male</th>
                  <th className="border border-gray-300 p-2 text-center">Female</th>
                </tr>
              </thead>
              <tbody>
                {workerData.map((worker, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <Input
                        value={worker.function}
                        onChange={(e) => {
                          const newData = [...workerData];
                          newData[index].function = e.target.value;
                          setWorkerData(newData);
                        }}
                        placeholder="Enter function"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={worker.permanentMale}
                        onChange={(e) => {
                          const newData = [...workerData];
                          newData[index].permanentMale = e.target.value;
                          setWorkerData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={worker.permanentFemale}
                        onChange={(e) => {
                          const newData = [...workerData];
                          newData[index].permanentFemale = e.target.value;
                          setWorkerData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={worker.otherMale}
                        onChange={(e) => {
                          const newData = [...workerData];
                          newData[index].otherMale = e.target.value;
                          setWorkerData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={worker.otherFemale}
                        onChange={(e) => {
                          const newData = [...workerData];
                          newData[index].otherFemale = e.target.value;
                          setWorkerData(newData);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 p-2">Total</td>
                  <td className="border border-gray-300 p-2 text-center">{workerTotals.permanentMale}</td>
                  <td className="border border-gray-300 p-2 text-center">{workerTotals.permanentFemale}</td>
                  <td className="border border-gray-300 p-2 text-center">{workerTotals.otherMale}</td>
                  <td className="border border-gray-300 p-2 text-center">{workerTotals.otherFemale}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 9. Human Resource Management - Differently Abled Personnel */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">9. Human Resource Management (Differently Abled Personnel)</h3>
            <Button onClick={addDifferentlyAbledRow} size="sm">Add Row</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Function</th>
                  <th className="border border-gray-300 p-2 text-center" colSpan={2}>Employed</th>
                  <th className="border border-gray-300 p-2 text-center" colSpan={2}>Contract</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2 text-center">Male</th>
                  <th className="border border-gray-300 p-2 text-center">Female</th>
                  <th className="border border-gray-300 p-2 text-center">Male</th>
                  <th className="border border-gray-300 p-2 text-center">Female</th>
                </tr>
              </thead>
              <tbody>
                {differentlyAbledData.map((data, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <Input
                        value={data.function}
                        onChange={(e) => {
                          const newData = [...differentlyAbledData];
                          newData[index].function = e.target.value;
                          setDifferentlyAbledData(newData);
                        }}
                        placeholder="Enter function"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={data.employedMale}
                        onChange={(e) => {
                          const newData = [...differentlyAbledData];
                          newData[index].employedMale = e.target.value;
                          setDifferentlyAbledData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={data.employedFemale}
                        onChange={(e) => {
                          const newData = [...differentlyAbledData];
                          newData[index].employedFemale = e.target.value;
                          setDifferentlyAbledData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={data.contractMale}
                        onChange={(e) => {
                          const newData = [...differentlyAbledData];
                          newData[index].contractMale = e.target.value;
                          setDifferentlyAbledData(newData);
                        }}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={data.contractFemale}
                        onChange={(e) => {
                          const newData = [...differentlyAbledData];
                          newData[index].contractFemale = e.target.value;
                          setDifferentlyAbledData(newData);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 p-2">Total</td>
                  <td className="border border-gray-300 p-2 text-center">{differentlyAbledTotals.employedMale}</td>
                  <td className="border border-gray-300 p-2 text-center">{differentlyAbledTotals.employedFemale}</td>
                  <td className="border border-gray-300 p-2 text-center">{differentlyAbledTotals.contractMale}</td>
                  <td className="border border-gray-300 p-2 text-center">{differentlyAbledTotals.contractFemale}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 10. Key Managerial Positions / Board of Directors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">10. Key Managerial Positions / Board of Directors</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-left">Details</th>
                  <th className="border border-gray-300 p-2 text-center">Board of Directors</th>
                  <th className="border border-gray-300 p-2 text-center">Key Managerial Personnel</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Male</td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={boardDirectors.male}
                      onChange={(e) => setBoardDirectors({ ...boardDirectors, male: e.target.value })}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={keyManagerial.male}
                      onChange={(e) => setKeyManagerial({ ...keyManagerial, male: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Female</td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={boardDirectors.female}
                      onChange={(e) => setBoardDirectors({ ...boardDirectors, female: e.target.value })}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={keyManagerial.female}
                      onChange={(e) => setKeyManagerial({ ...keyManagerial, female: e.target.value })}
                    />
                  </td>
                </tr>
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 p-2">Total</td>
                  <td className="border border-gray-300 p-2 text-center">{boardDirectors.total}</td>
                  <td className="border border-gray-300 p-2 text-center">{keyManagerial.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. Retrenchment details */}
        <div className="space-y-2">
          <Label htmlFor="retrenchmentDetails">11. Any retrenchment or mass dismissal of employees conducted?</Label>
          <Textarea
            id="retrenchmentDetails"
            value={formData.retrenchmentDetails}
            onChange={(e) => setFormData({ ...formData, retrenchmentDetails: e.target.value })}
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button onClick={handleSave} variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IRLHRInformation;
