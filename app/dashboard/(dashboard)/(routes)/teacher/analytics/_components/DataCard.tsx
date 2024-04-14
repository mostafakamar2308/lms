import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
}
function DataCard({ value, label, shouldFormat }: DataCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg mb-5 font-medium">{label}</CardTitle>
        <CardContent>
          <div className="text-2xl font-semibold">
            {shouldFormat ? formatPrice(value) : value}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default DataCard;
