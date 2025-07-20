import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export const StatsCard = ({ title, value, icon, trend, className }: StatsCardProps) => {
  return (
    <Card className={cn(
      "bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
          {trend && (
            <span className="text-sm text-accent font-medium">
              {trend}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};