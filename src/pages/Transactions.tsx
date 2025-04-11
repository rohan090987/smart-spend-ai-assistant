
import React from "react";
import Layout from "@/components/layout/Layout";
import TransactionList from "@/components/transactions/TransactionList";

const Transactions = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your transaction history
        </p>
      </div>
      
      <TransactionList />
    </Layout>
  );
};

export default Transactions;
