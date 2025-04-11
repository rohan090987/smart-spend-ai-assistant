
import React from "react";
import Layout from "@/components/layout/Layout";

const Budgets = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">
          Create and manage your spending budgets
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <p>Budgets page content will go here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Budgets;
