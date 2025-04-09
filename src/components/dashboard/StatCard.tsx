
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, className, trend }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-8 w-8 text-muted-foreground">{icon}</div>
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-bold">{value}</h2>
          {trend && (
            <p className={cn(
              "mt-2 text-sm",
              trend.positive ? "text-finance-green" : "text-finance-red"
            )}>
              <span className="inline-block mr-1">
                {trend.positive ? "↑" : "↓"}
              </span>
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
