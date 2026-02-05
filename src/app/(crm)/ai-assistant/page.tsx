"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  {
    label: "Generate Proposal",
    icon: <FileText size={16} />,
    prompt:
      "Create a professional project proposal for a web development project",
  },
  {
    label: "Business Insights",
    icon: <Lightbulb size={16} />,
    prompt: "Analyze our current business performance and suggest improvements",
  },
  {
    label: "Email Draft",
    icon: <MessageSquare size={16} />,
    prompt: "Draft a follow-up email for a potential client",
  },
  {
    label: "Content Ideas",
    icon: <Sparkles size={16} />,
    prompt: "Suggest 5 blog post ideas for our technology company",
  },
];

const mockResponses: Record<string, string> = {
  proposal: `# Project Proposal: Web Development Services

## Executive Summary
We are pleased to present our proposal for your web development project. Our team of experienced developers will deliver a modern, responsive, and scalable solution.

## Scope of Work
- **Discovery Phase**: Requirements gathering and analysis
- **Design Phase**: UI/UX design with client approval
- **Development Phase**: Full-stack implementation
- **Testing Phase**: QA and user acceptance testing
- **Deployment**: Production deployment and training

## Timeline
- Total Duration: 8-10 weeks
- Design: 2 weeks
- Development: 5-6 weeks
- Testing & Launch: 1-2 weeks

## Investment
Starting at $15,000 based on final requirements.`,
  insights: `# Business Performance Analysis

## Key Metrics
- **Revenue Growth**: 12.5% increase this quarter
- **Client Retention**: 92% retention rate
- **Project Completion**: 85% on-time delivery

## Recommendations
1. **Expand Service Offerings**: Consider adding AI/ML development services
2. **Client Engagement**: Implement quarterly business reviews
3. **Process Optimization**: Automate invoice generation and follow-ups
4. **Team Development**: Invest in upskilling for emerging technologies`,
  email: `Subject: Following Up on Our Recent Conversation

Dear [Client Name],

I hope this email finds you well. I wanted to follow up on our recent discussion regarding your project requirements.

I've had a chance to review your needs in detail, and I'm confident that our team can deliver an excellent solution that meets your objectives.

I'd love to schedule a brief call this week to discuss the next steps. Please let me know your availability.

Best regards,
[Your Name]
JEVXO Team`,
  content: `# Blog Post Ideas for Technology Company

1. **"The Future of AI in Business Operations"**
   - Explore how AI is transforming daily business processes
   
2. **"Remote Work: Building Effective Distributed Teams"**
   - Share strategies for managing remote teams successfully
   
3. **"Cybersecurity Best Practices for SMBs"**
   - Essential security measures for small businesses
   
4. **"How to Choose the Right Tech Stack for Your Startup"**
   - Guide for founders making technology decisions
   
5. **"The ROI of Digital Transformation"**
   - Case studies showing measurable business impact`,
  default: `I understand your request. Here's a comprehensive response based on your query:

**Analysis:**
Your request has been processed and I'm providing relevant insights and recommendations.

**Key Points:**
1. I've analyzed the context of your question
2. Here are actionable suggestions based on best practices
3. Consider implementing these strategies for optimal results

**Next Steps:**
- Review the recommendations above
- Prioritize based on your immediate needs
- Reach out if you need more specific guidance

Is there anything specific you'd like me to elaborate on?`,
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("proposal")) return mockResponses.proposal;
    if (lowerPrompt.includes("insight") || lowerPrompt.includes("performance"))
      return mockResponses.insights;
    if (lowerPrompt.includes("email") || lowerPrompt.includes("follow"))
      return mockResponses.email;
    if (lowerPrompt.includes("content") || lowerPrompt.includes("blog"))
      return mockResponses.content;
    return mockResponses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getResponse(input),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-10rem)]">
      <div>
        <h1 className="module-header">AI Assistant</h1>
        <p className="subtle-text mt-1">
          Generate content, proposals, and get business insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-5rem)]">
        {/* Quick Prompts Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleQuickPrompt(item.prompt)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Proposals</Badge>
                <Badge variant="secondary">Emails</Badge>
                <Badge variant="secondary">Analysis</Badge>
                <Badge variant="secondary">Content</Badge>
                <Badge variant="secondary">Reports</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                      Start a conversation
                    </h3>
                    <p className="text-sm text-muted-foreground/70 max-w-md">
                      Ask me to generate proposals, draft emails, analyze
                      business data, or create content for your company.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4" />
                              <span className="text-xs font-medium">
                                AI Assistant
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                handleCopy(message.content, message.id)
                              }
                            >
                              {copiedId === message.id ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </Button>
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[60px] resize-none"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="px-6"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
