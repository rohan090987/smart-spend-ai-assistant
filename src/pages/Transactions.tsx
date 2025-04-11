
import React from "react";
import Layout from "@/components/layout/Layout";

const Transactions = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your transaction history
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <p>Transactions page content will go here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
