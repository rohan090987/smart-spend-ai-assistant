
import React from "react";
import Layout from "@/components/layout/Layout";
import SettingsForm from "@/components/settings/SettingsForm";

const Settings = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>
      
      <SettingsForm />
    </Layout>
  );
};

export default Settings;
