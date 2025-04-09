
import React from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/dashboard/StatCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your finances.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Balance"
          value="$5,240.50"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{
            value: 2.5,
            label: "from last month",
            positive: true
          }}
        />
        <StatCard
          title="Monthly Spending"
          value="$2,680.45"
          icon={<CreditCard className="h-5 w-5" />}
          trend={{
            value: 4.2,
            label: "from last month",
            positive: false
          }}
        />
        <StatCard
          title="Monthly Income"
          value="$4,350.00"
          icon={<ArrowDownRight className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <SpendingChart />
        <BudgetProgress />
      </div>
      
      <div className="mt-6">
        <RecentTransactions />
      </div>
    </Layout>
  );
};

export default Index;
