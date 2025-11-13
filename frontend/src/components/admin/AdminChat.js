import React, { useState, useEffect } from 'react';
import { adminApiCall } from '../../utils/adminApi';

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchActiveChats();
    const interval = setInterval(fetchActiveChats, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchActiveChats = async () => {
    try {
      const res = await adminApiCall('/api/chat/active');
      setUsers(res.data?.users || res.users || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await adminApiCall(`/api/chat/messages?userId=${selectedUser.id}`);
      setMessages(res.data?.messages || res.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await adminApiCall('/api/chat/messages', {
        method: 'POST',
        body: JSON.stringify({ message: newMessage, userId: selectedUser.id })
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customer Support Chat</h1>

      <div className="grid grid-cols-3 gap-6 h-[600px]">
        <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">Active Chats</h2>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded cursor-pointer mb-2 ${
                selectedUser?.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <p className="font-medium">{user.displayName || user.email}</p>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedUser.displayName || selectedUser.email}</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      msg.isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
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
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
