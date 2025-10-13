import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from '../chat-input/ChatInput';
import {ChatMessage} from "../chat-messages/ChatMessage";

import './ChatContainer.css';


export const ChatContainer = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! Type "help" to start.', sender: 'bot' }
    ]);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-messages" ref={messagesContainerRef}>
                {messages.map((message, idx) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={addMessage} />
        </div>
    );
};
