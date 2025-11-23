
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import issuesData from "../data/issues.json";

const Issues = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="mr-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              💚 Get Support
            </h1>
            <p className="text-gray-600 mt-2">Helpful strategies for common mental health concerns!</p>
          </div>
        </motion.div>

        {/* Issues Cards */}
        <div className="space-y-4">
          {issuesData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-400"
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 text-left flex items-center justify-between focus:outline-none"
              >
                <div className="flex items-center">
                  <AlertCircle className="text-orange-500 mr-3 flex-shrink-0" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">
                    {item.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="text-orange-500" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={24} />
                  )}
                </motion.div>
              </motion.button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openItems.includes(item.id) ? "auto" : 0,
                  opacity: openItems.includes(item.id) ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4 ml-8">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 leading-relaxed">
                        <strong>💡 Solution:</strong> {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need more support? 🤷‍♀️</h3>
            <p className="mb-6 opacity-90">
              Don't worry! Share what you're going through and I'll provide supportive guidance.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/chat")}
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              💬 Chat with Me
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Issues;
