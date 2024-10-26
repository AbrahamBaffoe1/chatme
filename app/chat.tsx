// pages/chat.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: any;

const ChatPage = () => {
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')!);
    socket = io();

    socket.emit('join', user.id);

    socket.on('message', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Fetch initial messages
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (input.trim() === '') return;
    socket.emit('message', { user: user.id, message: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-l-lg"
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-600 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
