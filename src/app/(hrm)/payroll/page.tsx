import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Download,
  Calculator,
} from "lucide-react";
import { format } from "date-fns";
import { mockPartners, mockStaff } from "@/data/mock-data";

const Payroll = () => {
  // Calculate payroll for all partners
  const partnerPayroll = mockPartners.map((partner) => ({
    ...partner,
    grossSalary: partner.baseSalary,
    payable: partner.payableAmount,
    arrears: partner.arrears,
    deductions: partner.baseSalary * 0.05, // 5% deductions
    netPayable: partner.payableAmount - partner.baseSalary * 0.05,
  }));

  // Calculate payroll for staff (full salary)
  const staffPayroll = mockStaff
    .filter((s) => s.role !== "partner")
    .map((staff) => ({
      ...staff,
      grossSalary: staff.baseSalary,
      deductions: staff.baseSalary * 0.15, // 15% tax + benefits
      netPayable: staff.baseSalary * 0.85,
    }));

  const totalPartnerPayable = partnerPayroll.reduce(
    (sum, p) => sum + p.netPayable,
    0,
  );
  const totalStaffPayable = staffPayroll.reduce(
    (sum, s) => sum + s.netPayable,
    0,
  );
  const totalPayable = totalPartnerPayable + totalStaffPayable;
  const totalArrears = partnerPayroll.reduce((sum, p) => sum + p.arrears, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="module-header">Payroll</h1>
          <p className="subtle-text mt-1">
            Manage salary processing and payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="gap-2">
            <Calculator size={16} />
            Process Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payable</p>
                <p className="text-2xl font-bold">
                  ${totalPayable.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/20">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff Payroll</p>
                <p className="text-2xl font-bold">
                  ${totalStaffPayable.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/20">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partner Payroll</p>
                <p className="text-2xl font-bold">
                  ${totalPartnerPayable.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/20">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Arrears</p>
                <p className="text-2xl font-bold">
                  ${totalArrears.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners">
            Partner Payroll (30/70 Split)
          </TabsTrigger>
          <TabsTrigger value="staff">Staff Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Partner Payroll - {format(new Date(), "MMMM yyyy")}
                </CardTitle>
                <Badge variant="outline" className="bg-info/20 text-info">
                  30% Payable / 70% Arrears
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>JEVXO ID</TableHead>
                    <TableHead className="text-right">Gross Salary</TableHead>
                    <TableHead className="text-right">Payable (30%)</TableHead>
                    <TableHead className="text-right">Arrears (70%)</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Payable</TableHead>
                    <TableHead>Equity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerPayroll.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {p.jevxoUuid}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        ${p.grossSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-success">
                        ${p.payable.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-warning">
                        ${p.arrears.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        -${p.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${p.netPayable.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.isShareEligible ? "default" : "secondary"}
                          className={
                            p.isShareEligible
                              ? "bg-success/20 text-success"
                              : ""
                          }
                        >
                          {p.isShareEligible ? "Eligible" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>
                Staff Payroll - {format(new Date(), "MMMM yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>JEVXO ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Gross Salary</TableHead>
                    <TableHead className="text-right">
                      Deductions (15%)
                    </TableHead>
                    <TableHead className="text-right">Net Payable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPayroll.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {s.jevxoUuid}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {s.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${s.grossSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        -${s.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${s.netPayable.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
