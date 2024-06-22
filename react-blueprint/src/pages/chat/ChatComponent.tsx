import { useEffect, useState } from 'react';
import { BASE_WS_PATH } from '../../common/config';
import { io } from 'socket.io-client';
import { StorageService } from '../../common/services/StorageService';

type ChatMessage = {
    userId: string;
    message: string;
};

let socket = io(BASE_WS_PATH);

export const ChatComponent = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        connectSocket();

        return () => {
            socket.close();
        };
    }, []);

    const connectSocket = () => {
        const authToken = StorageService.get('user')?.accessToken;
        socket = io(BASE_WS_PATH, { extraHeaders: { authorization: `Bearer ${authToken}` } });

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
        socket.on('message', (data: ChatMessage) => {
            setMessages((prev) => [...prev, data]);
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    };

    const sendMessage = () => {
        socket.emit('message', message);
        setMessage('');
    };

    return (
        <section>
            <h2>Chat</h2>
            <hr />
            <div>
                {messages.map((m, i) => (
                    <p key={i}>
                        {m.message} ({m.userId})
                    </p>
                ))}
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
                <button onClick={sendMessage}>Send</button>
            </div>
        </section>
    );
};
