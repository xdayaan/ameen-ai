import React, { useState, useRef } from 'react';
import './Chatbot.css';
import logo from './logo512.png';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atelierSulphurpoolDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatbotRef = useRef();

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      sendMessage();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && userInput.trim() !== '') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    // Add user message to chat history
    setChatHistory((prevChatHistory) => [...prevChatHistory, { text: userInput, isUser: true }]);

    // Clear user input field
    setUserInput('');

    // Set loading to true to show the loader
    setLoading(true);

    try {
      // Make API call to AI.Potential for chatbot response
      const response = await fetch('https://ai.potential.com/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: 'System Role',
          message: JSON.stringify(userInput), // Use JSON.stringify to preserve JSON structure
          AI: 'Ameen',
        }),
      });

      const data = await response.json();
      const botResponse = data.response; // Extract the 'response' value from the object

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { text: botResponse, isUser: false },
      ]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    } finally {
      setLoading(false); // Set loading to false whether there's an error or not
    }
  };

  const getFormattedMessage = (message) => {
    const regex = /```([\s\S]*?)```/g; 

    const matches = message.match(regex);

    if (matches) {
      return (
        <SyntaxHighlighter language="C" style={atelierSulphurpoolDark}>
          {matches}
        </SyntaxHighlighter>
      )
    } else {
      return (
        message
      )
    }
  };

  return (
    <div className="chatbot">
      <nav className="navbar">
        <div className="logo">
          {loading ? <div className="loader" /> : <img src={logo} alt="Your Logo" />}
        </div>
      </nav>
      {chatHistory.length === 0 ? (
        <div className="chat-history-home">
          <div class='title'>Ameen AI</div>
          <div className="description">Start typing a message to chat with the AI.</div>
        </div>
      ) : (
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
              {getFormattedMessage(message.text)}
            </div>
          ))}
          <div ref={chatbotRef} />
        </div>
      )}
      <div className="user-input">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
  
}

export default App;