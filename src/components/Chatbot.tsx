import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChatInput from "./ChatInput";
import SuggestionButtons from "./SuggestionButtons";
import { chatService, type ChatMessage } from "@/services/chatService";
import { useToast } from "@/components/ui/use-toast";

const Chatbot = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: `Hi there! 👋 I'm here to support you with your mental health and well-being. How are you feeling today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "I'm feeling anxious",
    "How can I manage stress?",
    "I'm having trouble sleeping",
    "What are some self-care tips?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await chatService.sendMessage(messageText, messages);

      if (response.status === 'error') {
        throw new Error(response.error || 'Failed to get response');
      }

      // Format response with sources if available
      let responseText = response.response;
      if (response.used_knowledge_base && response.sources && response.sources.length > 0) {
        // Sources are already included in response text, but we can enhance display
        const uniqueSources = [...new Set(response.sources)];
        if (uniqueSources.length > 0 && !responseText.includes('📚')) {
          // Add source indicator if not already present
          responseText += `\n\n📚 *Based on: ${uniqueSources.join(', ')}*`;
        }
      }

      // Add bot response
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from the chatbot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </motion.button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl mr-3">
              🤖
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Mental Health Support Chat</h1>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isUser 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'bg-white text-gray-800 shadow-md border'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white px-4 py-3 rounded-2xl shadow-md border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white border-t p-4"
      >
        <div className="max-w-4xl mx-auto">
          {/* Suggestions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">💡 Try asking about:</p>
            <SuggestionButtons
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
          
          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
