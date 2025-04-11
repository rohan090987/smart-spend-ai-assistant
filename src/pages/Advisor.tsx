
import React from "react";
import Layout from "@/components/layout/Layout";
import AIAdvisor from "@/components/advisor/AIAdvisor";

const Advisor = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Financial Advisor</h1>
        <p className="text-muted-foreground">
          Get personalized financial advice and insights
        </p>
      </div>
      
      <AIAdvisor />
    </Layout>
  );
};

export default Advisor;
