import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

const config = {
  botName: "CrowdTrust Bot",
  initialMessages: [{ id: 1, message: "Hi! How can I help you today?", createdAt: Date.now() }],
};

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.toLowerCase().includes('mission')) {
      actions.handleMission();
    } else {
      actions.handleDefault();
    }
  };
  return <div>{React.Children.map(children, child => React.cloneElement(child, { parse }))}</div>;
};

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleMission = () => {
    const botMessage = createChatBotMessage("Our mission is to support underprivileged children!");
    setState((prev) => ({ ...prev, messages: [...prev.messages, botMessage] }));
  };

  const handleDefault = () => {
    const botMessage = createChatBotMessage("Ask me about our mission or how to donate!");
    setState((prev) => ({ ...prev, messages: [...prev.messages, botMessage] }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => React.cloneElement(child, { actions: { handleMission, handleDefault } }))}
    </div>
  );
};

const ChatbotComponent = () => {
  return (
    <div className="fixed bottom-4 right-4 w-80">
      <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />
    </div>
  );
};

export default ChatbotComponent;