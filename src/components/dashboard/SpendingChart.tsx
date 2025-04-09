
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Mock data for spending by category
const spendingData = [
  {
    name: "Housing",
    amount: 1200,
  },
  {
    name: "Food",
    amount: 450,
  },
  {
    name: "Transport",
    amount: 300,
  },
  {
    name: "Shopping",
    amount: 280,
  },
  {
    name: "Entertainment",
    amount: 150,
  },
  {
    name: "Health",
    amount: 120,
  },
  {
    name: "Utilities",
    amount: 180,
  }
];

export function SpendingChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Your spending by category this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={spendingData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              width={80}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, "Amount"]}
              labelStyle={{ color: "#111" }}
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "6px",
                border: "1px solid #e2e8f0"
              }}
            />
            <Legend />
            <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default SpendingChart;
