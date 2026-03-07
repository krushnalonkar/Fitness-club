import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaPaperPlane, FaTimes, FaDumbbell, FaRedo } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! I'm your GymPortal AI Assistant 💪. Ask me anything about fitness, workouts, or our gym plans!", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleNewChat = () => {
        setMessages([
            { text: "Hi there! I'm your GymPortal AI Assistant 💪. Ask me anything about fitness, workouts, or our gym plans!", isBot: true }
        ]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        // Add user message to UI immediately
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInput('');
        setIsLoading(true);

        try {
            console.log("Sending chat request to /api/chat");
            const res = await axios.post('/api/chat', { message: userMessage });
            setMessages(prev => [...prev, { text: res.data.text, isBot: true }]);
        } catch (error) {
            console.error("FULL CHAT ERROR:", error);
            const errorMsg = error.response?.data?.error || error.response?.data?.text || "Sorry, I'm having trouble connecting right now. Please try again later.";
            setMessages(prev => [...prev, { text: errorMsg, isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] transition duration-300"
                    >
                        <FaCommentDots size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 right-0 w-80 sm:w-96 bg-dark-200 border border-dark-400 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="bg-purple-600 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FaDumbbell className="text-white" size={20} />
                                <h3 className="text-white font-bold">GymPortal AI</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleNewChat}
                                    title="New Chat"
                                    className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded"
                                >
                                    <FaRedo size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-dark-400 scrollbar-track-dark-200">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl ${msg.isBot
                                            ? 'bg-dark-300 text-gray-200 rounded-tl-sm border border-dark-400'
                                            : 'bg-purple-600 text-white rounded-tr-sm'
                                            }`}
                                        style={{ whiteSpace: 'pre-wrap' }}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-dark-300 border border-dark-400 rounded-2xl rounded-tl-sm p-4 flex gap-1">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-dark-300 border-t border-dark-400">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask fitness query..."
                                    className="flex-1 bg-dark-200 text-white px-4 py-2 rounded-xl border border-dark-400 focus:outline-none focus:border-purple-500 transition"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className={`p-3 rounded-xl flex items-center justify-center transition ${!input.trim() || isLoading
                                        ? 'bg-dark-400 text-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-lg shadow-purple-500/20'
                                        }`}
                                >
                                    <FaPaperPlane size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
