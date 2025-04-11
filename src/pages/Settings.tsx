
import React from "react";
import Layout from "@/components/layout/Layout";

const Settings = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <p>Settings page content will go here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
