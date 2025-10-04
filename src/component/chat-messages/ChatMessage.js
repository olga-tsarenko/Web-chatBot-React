import React from 'react';

import './ChatMessage.css';

export const ChatMessage = React.memo(({ message }) => {
    return (
        <div className={`chat-message-${message.sender}`}>
            <div className="message-content">
                {message.text}
            </div>
            <div className="message-time">
                {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
});
