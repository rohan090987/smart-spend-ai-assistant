
import React from "react";
import Layout from "@/components/layout/Layout";

const Advisor = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Financial Advisor</h1>
        <p className="text-muted-foreground">
          Get personalized financial advice and insights
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <p>AI Advisor content will go here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Advisor;
