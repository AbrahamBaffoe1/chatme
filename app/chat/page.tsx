// ./app/chat/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface Message {
  user: string;
  message: string;
}

let socket: Socket;

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(user);
    socket = io();

    socket.emit('join', parsedUser.id);

    socket.on('message', (msg: Message) => {
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
  }, [router]);

  const sendMessage = () => {
    const user = localStorage.getItem('user');
    if (!user) return;

    const parsedUser = JSON.parse(user);
    if (input.trim() === '') return;

    socket.emit('message', { user: parsedUser.id, message: input });
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
