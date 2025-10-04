import React, { useState } from 'react';
import { ChatInput } from '../chat-input/ChatInput';
import {ChatMessage} from "../chat-messages/ChatMessage";

import './ChatContainer.css';


export const ChatContainer = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! Type "help" to start.', sender: 'bot' }
    ]);

    const addMessage = async (messageText) => {
        const newMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user'
        };

        setMessages(prev => [...prev, newMessage]);

        try {
            const response = await fetch('http://localhost:3031/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                text: data.text,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Connection error. Please try again.',
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </div>
            <ChatInput onSendMessage={addMessage} />
        </div>
    );
};
