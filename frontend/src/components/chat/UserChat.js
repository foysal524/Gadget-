import React, { useState, useEffect, useRef } from 'react';
import { apiCall } from '../../utils/api';

const UserChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user && !aiMode) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user, aiMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (aiMode) return;
    try {
      const res = await apiCall('/api/chat/messages');
      setMessages(res.data?.messages || res.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = newMessage;
    setNewMessage('');

    if (aiMode) {
      setMessages(prev => [...prev, { id: Date.now(), message: userMsg, isAdmin: false, createdAt: new Date() }]);
      setAiLoading(true);
      
      try {
        const res = await fetch('http://localhost:8000/api/ai-chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMsg })
        });
        const data = await res.json();
        
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          message: data?.data?.message || 'No response from AI', 
          isAdmin: true, 
          createdAt: new Date(),
          products: data?.data?.relatedProducts || [] 
        }]);
      } catch (error) {
        console.error('AI error:', error);
        setMessages(prev => [...prev, { id: Date.now() + 1, message: 'AI error. Switch to human support.', isAdmin: true, createdAt: new Date() }]);
      }
      setAiLoading(false);
    } else {
      try {
        await apiCall('/api/chat/messages', {
          method: 'POST',
          body: JSON.stringify({ message: userMsg })
        });
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          💬 Support
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Customer Support</h3>
              <button onClick={() => setIsOpen(false)} className="text-xl">&times;</button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => {
                  setAiMode(!aiMode);
                  setMessages([]);
                }}
                className={`px-3 py-1 rounded ${aiMode ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
              >
                {aiMode ? '🤖 AI Assistant' : '👤 Human Support'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  msg.isAdmin ? 'bg-gray-200 text-gray-900' : 'bg-blue-600 text-white'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  {msg.products?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.products.map(p => (
                        <div key={p.id} className="text-xs bg-white text-gray-800 p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => window.open(`/product/${p.id}`, '_blank')}>
                          {p.name} - BDT {p.price.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {aiLoading && <div className="text-gray-500 text-sm">AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserChat;
