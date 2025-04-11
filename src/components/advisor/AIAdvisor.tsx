
import React, { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, SendHorizontal, Loader2, Bot, User, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { advisorService } from "@/services/advisorService";

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
      content: "Hello! I'm your financial advisor. Ask me anything about your finances, budgeting, investing, or how to optimize your spending habits.",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  
  // Reference to the message container for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = async () => {
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
    
    try {
      // Call our advisor service
      const response = await advisorService.getAIResponse(query);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: "ai",
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiResponse]);
      
      // Show toast for new insight
      toast("New Financial Insight", {
        description: "AI advisor has analyzed your data and provided recommendations.",
        duration: 5000
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get financial advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-180px)]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle>AI Financial Advisor</CardTitle>
        </div>
        <CardDescription>
          Ask questions about your spending, saving goals, or get personalized financial advice
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto mb-4 space-y-4 pr-2">
          {conversation.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex gap-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
                  message.sender === 'user' ? 'bg-primary' : 'bg-muted'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div 
                  className={`rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Analyzing your finances...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
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
            className="resize-none min-h-[80px]"
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !query.trim()}
            className="shrink-0 self-end"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIAdvisor;
