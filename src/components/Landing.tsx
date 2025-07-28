
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Wrench, MessageCircle, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const Landing = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
      {/* Auth Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 right-6"
      >
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
              <User size={16} className="text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut size={18} className="text-gray-600" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className="bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-gray-700"
          >
            Sign In
          </motion.button>
        )}
      </motion.div>

      <div className="max-w-2xl mx-auto text-center">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-6xl shadow-2xl"
            >
              🤖
            </motion.div>
            
            {/* Waving hand animation */}
            <motion.div
              animate={{ 
                rotate: [0, 20, -10, 20, 0],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute -top-2 -right-2 text-3xl"
            >
              👋
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">DigiBuddy</span> 👋
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            {user 
              ? `Welcome back, ${user.user_metadata?.full_name?.split(' ')[0] || 'friend'}! Ready to explore the digital world?`
              : "Your tech-savvy buddy to explore the digital world!"
            }
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: BookOpen,
              title: "📘 Learn Basics",
              subtitle: "Digital fundamentals made simple",
              path: user ? "/faq" : "/auth",
              gradient: "from-green-400 to-blue-500"
            },
            {
              icon: Wrench,
              title: "🔧 Fix a Problem",
              subtitle: "Quick solutions for common issues",
              path: user ? "/issues" : "/auth",
              gradient: "from-yellow-400 to-orange-500"
            },
            {
              icon: MessageCircle,
              title: "💬 Ask a Question",
              subtitle: "Chat with me directly",
              path: user ? "/chat" : "/auth",
              gradient: "from-purple-400 to-pink-500"
            }
          ].map((item, index) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`p-6 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform group`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="text-3xl mb-2"
                >
                  <item.icon size={32} className="mx-auto" />
                </motion.div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm opacity-90">{item.subtitle}</p>
                {!user && (
                  <p className="text-xs opacity-75">(Sign in required)</p>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 text-gray-500"
        >
          <p>Ready to become a digital expert? Let's start exploring! ✨</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
