
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar pr-0 sm:max-w-xs">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1">
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      
      <Button variant="ghost" size="icon" className="shrink-0">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      
      <Avatar className="h-8 w-8">
        <AvatarImage src="" alt="User" />
        <AvatarFallback>US</AvatarFallback>
      </Avatar>
    </header>
  );
}

export default Header;
