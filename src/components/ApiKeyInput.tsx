
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
      localStorage.setItem('openai_api_key', apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Key className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Enter OpenAI API Key</h2>
        <p className="text-sm text-slate-600">
          Your API key is stored locally and never sent to our servers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          Start Chatting
        </Button>
      </form>

      <div className="mt-4 text-xs text-slate-500">
        <p>Don't have an API key? Get one from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Platform</a></p>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
