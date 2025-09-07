import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  prevValue?: string | number;
  icon: LucideIcon;
  trend?: number;
}

const MetricCard = ({
  title,
  value,
  prevValue,
  icon: Icon,
  trend = 0,
}: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <div className="flex items-center mt-1">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              ) : null}
              <p
                className={`text-xs ${trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"}`}
              >
                {trend !== 0 && (trend > 0 ? "+" : "")}
                {trend}% {prevValue && `from ${prevValue}`}
              </p>
            </div>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default MetricCard;
