
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, SendHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIAdvisor() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: "initial",
      content: "Hello! I'm your financial advisor. Ask me anything about your finances, budgeting, or how to optimize your spending habits.",
      sender: "ai",
      timestamp: new Date()
    }
  ]);

  // Mock AI responses based on common financial questions
  const getAIResponse = (userQuery: string): string => {
    const normalizedQuery = userQuery.toLowerCase();
    
    if (normalizedQuery.includes("save") || normalizedQuery.includes("saving")) {
      return "Based on your spending patterns, you could save approximately $250 per month by reducing restaurant expenses. Consider cooking at home more often and meal prepping for the week.";
    }
    
    if (normalizedQuery.includes("budget") || normalizedQuery.includes("spend")) {
      return "Looking at your current budget, your highest expense category is housing at 35% of your income. Financial experts typically recommend keeping housing costs under 30% of your income. You might want to evaluate if there are ways to reduce this expense.";
    }
    
    if (normalizedQuery.includes("invest") || normalizedQuery.includes("investing")) {
      return "Based on your financial profile, you have about $400 per month that could be directed toward investments. Consider starting with a retirement account like a 401(k) or IRA, especially if your employer offers matching contributions.";
    }
    
    if (normalizedQuery.includes("debt") || normalizedQuery.includes("loan")) {
      return "I notice you have credit card debt with high interest rates. Prioritizing paying off these high-interest debts before focusing on other financial goals could save you money in the long run. Consider the snowball or avalanche method for debt repayment.";
    }
    
    return "Based on your recent transaction history and spending patterns, I recommend creating a budget for entertainment expenses. You spent 20% more in this category compared to last month. Setting a specific limit could help you stay on track with your financial goals.";
  };

  const handleSend = () => {
    if (!query.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: "user",
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(query),
        sender: "ai",
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiResponse]);
      setLoading(false);
      
      // Show toast for new insight
      toast("New Financial Insight", {
        description: "AI advisor has analyzed your data and provided new recommendations.",
        duration: 5000
      });
    }, 1500);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-180px)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-finance-green" />
          <CardTitle>AI Financial Advisor</CardTitle>
        </div>
        <CardDescription>
          Ask questions about your spending, saving goals, or financial advice
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto mb-4 space-y-4">
          {conversation.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Analyzing your finances...</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Textarea 
            placeholder="Ask about your finances..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="resize-none"
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !query.trim()}
            className="shrink-0"
          >
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIAdvisor;
