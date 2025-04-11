
import React from "react";
import Layout from "@/components/layout/Layout";
import BudgetManager from "@/components/budgets/BudgetManager";

const Budgets = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">
          Create and manage your spending budgets
        </p>
      </div>
      
      <BudgetManager />
    </Layout>
  );
};

export default Budgets;
