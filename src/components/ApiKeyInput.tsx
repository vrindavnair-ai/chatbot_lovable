
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Eye, EyeOff, Info } from "lucide-react";
import { LLMProvider } from "@/services/llmService";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string, provider: LLMProvider) => void;
}

const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<LLMProvider>("huggingface");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim(), provider);
      localStorage.setItem('llm_api_key', apiKey.trim());
      localStorage.setItem('llm_provider', provider);
    }
  };

  const getProviderInfo = (provider: LLMProvider) => {
    switch (provider) {
      case 'huggingface':
        return {
          name: 'Hugging Face (Free)',
          description: 'Free inference API with rate limits',
          link: 'https://huggingface.co/settings/tokens',
          placeholder: 'hf_...'
        };
      case 'groq':
        return {
          name: 'Groq (Free)',
          description: 'Fast inference with generous free tier',
          link: 'https://console.groq.com/keys',
          placeholder: 'gsk_...'
        };
      case 'openai':
        return {
          name: 'OpenAI (Paid)',
          description: 'Premium GPT models',
          link: 'https://platform.openai.com/api-keys',
          placeholder: 'sk-...'
        };
      default:
        return {
          name: 'Unknown',
          description: '',
          link: '',
          placeholder: ''
        };
    }
  };

  const currentProvider = getProviderInfo(provider);

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Key className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Choose LLM Provider</h2>
        <p className="text-sm text-slate-600">
          Your API key is stored locally and never sent to our servers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Provider</label>
          <Select value={provider} onValueChange={(value) => setProvider(value as LLMProvider)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="huggingface">Hugging Face (Free)</SelectItem>
              <SelectItem value="groq">Groq (Free)</SelectItem>
              <SelectItem value="openai">OpenAI (Paid)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">{currentProvider.name}</p>
              <p>{currentProvider.description}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={currentProvider.placeholder}
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
        <p>
          Don't have an API key? Get one from{' '}
          <a 
            href={currentProvider.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            {provider === 'huggingface' ? 'Hugging Face' : provider === 'groq' ? 'Groq' : 'OpenAI'}
          </a>
        </p>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
