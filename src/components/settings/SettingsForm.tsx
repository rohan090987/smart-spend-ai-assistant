
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const SettingsForm = () => {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "(555) 123-4567"
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    monthlyReports: true,
    darkMode: false,
    budgetAlerts: true
  });

  const [currency, setCurrency] = useState("USD");
  const [accountCollapsed, setAccountCollapsed] = useState(false);
  const [preferencesCollapsed, setPreferencesCollapsed] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully", {
      description: "Your profile information has been saved.",
    });
  };

  const handlePreferencesUpdate = () => {
    toast.success("Preferences updated successfully", {
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <Collapsible 
        open={!accountCollapsed} 
        onOpenChange={setAccountCollapsed}
        className="w-full"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {accountCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <Collapsible 
        open={!preferencesCollapsed} 
        onOpenChange={setPreferencesCollapsed}
        className="w-full"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your app preferences and notifications</CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {preferencesCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex-1">
                      Email Notifications
                      <span className="text-sm text-muted-foreground block">
                        Receive emails about account activity
                      </span>
                    </Label>
                    <Switch 
                      id="email-notifications" 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, emailNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthly-reports" className="flex-1">
                      Monthly Reports
                      <span className="text-sm text-muted-foreground block">
                        Receive monthly spending and saving reports
                      </span>
                    </Label>
                    <Switch 
                      id="monthly-reports" 
                      checked={preferences.monthlyReports}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, monthlyReports: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budget-alerts" className="flex-1">
                      Budget Alerts
                      <span className="text-sm text-muted-foreground block">
                        Notifications when approaching budget limits
                      </span>
                    </Label>
                    <Switch 
                      id="budget-alerts" 
                      checked={preferences.budgetAlerts}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, budgetAlerts: checked })
                      }
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Display</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="flex-1">
                      Dark Mode
                      <span className="text-sm text-muted-foreground block">
                        Use dark theme for the application
                      </span>
                    </Label>
                    <Switch 
                      id="dark-mode" 
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, darkMode: checked })
                      }
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Currency</h3>
                  <div className="flex gap-2">
                    {["USD", "EUR", "GBP", "CAD", "AUD"].map((curr) => (
                      <Button
                        key={curr}
                        variant={currency === curr ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrency(curr)}
                        className="min-w-[60px]"
                      >
                        {currency === curr && <Check className="mr-1 h-3 w-3" />}
                        {curr}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button onClick={handlePreferencesUpdate}>Save Preferences</Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Control your data and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button variant="outline">Export Financial Data</Button>
            <p className="text-sm text-muted-foreground">
              Download all your transaction and budget data as CSV
            </p>
          </div>
          
          <Separator />
          
          <div className="grid gap-2">
            <Button variant="destructive">Delete Account</Button>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsForm;
