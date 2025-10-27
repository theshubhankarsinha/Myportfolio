import { useEffect } from "react";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.dataset.chatbotId = "E_9Waxlhpf_S92v0JbsVw"; // replace with your Chatbase bot ID
    script.dataset.domain = "shubhankarsinha.com"; // optional: use your real domain
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* Your existing site components go here */}
      <h1>Welcome to my portfolio</h1>
      <p>This site showcases my projects and experiences.</p>
    </>
  );
}

export default App;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
