import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Star, MessageSquareCode, BadgeCheck } from 'lucide-react';
import { Vehicle } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  vehicle: Vehicle;
  pickup: string;
  dropoff: string;
  initialFare: number;
  onDealDone: (amount: string) => void;
}

export default function Chat({ vehicle, pickup, dropoff, initialFare, onDealDone }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10); // Starts from 10% (red)
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          vehicleInfo: vehicle,
          pickup,
          dropoff,
          initialFare
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.content };
      setMessages(prev => [...prev, assistantMessage]);

      // Bargaining Meter logic (simulated progress)
      setProgress(prev => Math.min(95, prev + Math.floor(Math.random() * 15) + 5));

      if (data.content.includes('DEAL_DONE:')) {
        const amount = data.content.split('DEAL_DONE:')[1].trim();
        setProgress(100);
        setTimeout(() => onDealDone(amount), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMeterColor = () => {
    if (progress < 40) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="glass-panel fixed inset-0 z-50 flex flex-col md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] md:rounded-3xl md:shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <User className="text-zinc-400" size={20} />
          </div>
          <div>
            <div className="font-bold text-white">{vehicle.driver.name}</div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold uppercase tracking-wider">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {vehicle.driver.rating} • {vehicle.type}
            </div>
          </div>
        </div>
        <div className="text-[10px] text-zinc-400 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">
          {vehicle.driver.license}
        </div>
      </div>

      {/* Bargaining Meter */}
      <div className="px-4 py-5 bg-white/5 border-b border-white/10">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-black">
          <span>Bargaining Meter</span>
          <span className="text-amber-400 uppercase">{100 - progress}% Friction Remaining</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-green-500 transition-all duration-700"
          />
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/20 backdrop-blur-sm"
      >
        <div className="flex justify-center">
          <span className="text-[10px] bg-white/5 border border-white/5 text-zinc-500 px-3 py-1 rounded-full uppercase font-bold tracking-widest">
            Conversation Started
          </span>
        </div>

        {messages.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-amber-400 text-black font-semibold rounded-tr-none'
                  : 'bg-zinc-800/80 text-white rounded-tl-none border border-white/10 backdrop-blur-sm'
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/80 text-white px-4 py-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1.5 items-center">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-black/40 backdrop-blur-xl border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mama, ektu kom koren..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1.5 p-2.5 bg-amber-400 text-black rounded-xl disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            <Send size={18} strokeWidth={3} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
