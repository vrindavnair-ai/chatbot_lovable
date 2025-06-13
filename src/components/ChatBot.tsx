
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ApiKeyInput from "./ApiKeyInput";
import { Bot } from "lucide-react";
import { LLMService, LLMMessage, LLMProvider } from "@/services/llmService";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [llmService, setLlmService] = useState<LLMService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem('llm_api_key');
    const savedProvider = localStorage.getItem('llm_provider') as LLMProvider;
    if (savedApiKey && savedProvider) {
      setLlmService(new LLMService(savedApiKey, savedProvider));
      setMessages([
        {
          id: "1",
          text: `Hello! I'm your AI assistant powered by ${savedProvider}. How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string, provider: LLMProvider) => {
    setLlmService(new LLMService(apiKey, provider));
    setMessages([
      {
        id: "1",
        text: `Hello! I'm your AI assistant powered by ${provider}. How can I help you today?`,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const generateBotResponse = async (userMessage: string) => {
    if (!llmService) {
      toast.error("API key not configured");
      return;
    }

    setIsTyping(true);

    try {
      // Convert messages to LLM format
      const llmMessages: LLMMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Be concise and friendly in your responses.'
        },
        ...messages.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await llmService.generateResponse(llmMessages);

      if (response.error) {
        toast.error(response.error);
        setIsTyping(false);
        return;
      }

      const botMessage: Message = {
        id: Date.now().toString() + "-bot",
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    generateBotResponse(text);
  };

  if (!llmService) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center h-[600px]">
        <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-white shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-slate-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Assistant</h3>
            <p className="text-sm text-slate-500">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </Card>
  );
};

export default ChatBot;
