import './App.css';

import { ChatContainer } from './component/chat-container/ChatContainer';

export const App = () => {
  return (
      <div className="App">
          <header className="App-header">
              <h1>React ChatBot</h1>
          </header>
          <ChatContainer />
      </div>
  );
}
