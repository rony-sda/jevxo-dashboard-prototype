import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Partner {
  id: string;
  name: string;
  role: string;
  baseSalary: number;
  payable: number;
  arrears: number;
  daysActive: number;
  isShareEligible: boolean;
}

const partners: Partner[] = [
  {
    id: "JEVXO-001",
    name: "Sarah Chen",
    role: "Senior Developer",
    baseSalary: 5000,
    payable: 1500,
    arrears: 3500,
    daysActive: 145,
    isShareEligible: true,
  },
  {
    id: "JEVXO-002",
    name: "Marcus Johnson",
    role: "UI/UX Designer",
    baseSalary: 4500,
    payable: 1350,
    arrears: 3150,
    daysActive: 98,
    isShareEligible: false,
  },
  {
    id: "JEVXO-003",
    name: "Emily Rodriguez",
    role: "Project Manager",
    baseSalary: 4800,
    payable: 1440,
    arrears: 3360,
    daysActive: 132,
    isShareEligible: true,
  },
  {
    id: "JEVXO-004",
    name: "David Kim",
    role: "Full Stack Developer",
    baseSalary: 5200,
    payable: 1560,
    arrears: 3640,
    daysActive: 45,
    isShareEligible: false,
  },
];

export const PartnerPayroll = () => {
  return (
    <div className="p-6 bg-[#0B111E]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">Partner Payroll</h2>
          <p className="text-sm text-muted-foreground mt-1">
            30% Payable • 70% Arrears (Pre-Profit Threshold)
          </p>
        </div>
        <Button variant="outline" size="sm">
          Process Payroll
        </Button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-warning/10 border border-warning/30">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">
            Pre-Profit Threshold Active
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Until board-certified profit threshold is reached, 30% of base
            salary is payable. The remaining 70% is tracked as arrears.
          </p>
        </div>
      </div>

      {/* Partners Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                PARTNER
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                JEVXO UUID
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                BASE
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                PAYABLE (30%)
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                ARREARS (70%)
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">
                EQUITY
              </th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr
                key={partner.id}
                className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-foreground">
                        {partner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {partner.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {partner.role}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs font-mono text-muted-foreground">
                    {partner.id}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-medium text-foreground">
                    ${partner.baseSalary.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-medium text-success">
                    ${partner.payable.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-medium text-warning">
                    ${partner.arrears.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  {partner.isShareEligible ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                      <CheckCircle2 size={14} />
                      <span>Eligible</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                      <Clock size={14} />
                      <span>{120 - partner.daysActive}d left</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">$19,500</p>
          <p className="text-xs text-muted-foreground">Total Base Salary</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">$5,850</p>
          <p className="text-xs text-muted-foreground">Total Payable</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-warning">$13,650</p>
          <p className="text-xs text-muted-foreground">Total Arrears</p>
        </div>
      </div>
    </div>
  );
};
