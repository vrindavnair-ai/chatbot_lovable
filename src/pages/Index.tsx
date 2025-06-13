
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Chat Assistant</h1>
          <p className="text-slate-600">Your intelligent conversation partner</p>
        </div>
        <ChatBot />
      </div>
    </div>
  );
};

export default Index;
