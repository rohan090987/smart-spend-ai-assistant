
import React from "react";
import Layout from "@/components/layout/Layout";
import GoalTracker from "@/components/goals/GoalTracker";

const Goals = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
        <p className="text-muted-foreground">
          Set and track your financial goals
        </p>
      </div>
      
      <GoalTracker />
    </Layout>
  );
};

export default Goals;
