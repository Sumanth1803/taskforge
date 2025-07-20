import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, description, trend, className }: StatsCardProps) => {
  return (
    <Card className={cn(
      "bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {trend && (
            <span className={cn(
              "text-xs font-medium flex items-center",
              trend.isPositive ? "text-emerald-500" : "text-red-500"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};