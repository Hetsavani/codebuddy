'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Send, X } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from './constants/prompt'
const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const chatRef = useRef(null);

  const programmingLanguage = 'no data - detect from code' // Or get this from your app's state/props

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const messagesEndRef = useRef(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const handleInputChange = (e) => setInputMessage(e.target.value)
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("");
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome?.storage?.local) {
      chrome.storage.local.get(
        ["codebuddy_api_key", "codebuddy_model"],
        (res) => {
          if (res.codebuddy_api_key) {
            setApiKey(res.codebuddy_api_key);
          }
          if (res.codebuddy_model) {
            setModelName(res.codebuddy_model);
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!apiKey || !modelName) return;

    const genAI = new GoogleGenerativeAI(apiKey);

    const metaDescriptionEl = document.querySelector('meta[name=description]');
    const problemStatement = metaDescriptionEl?.getAttribute('content') || '';

    const topics = getTopics().join(', ');
    const hints = getHints().map((hint, index) => `${index + 1}. ${hint}`).join('\n');

    const systemPromptModified = SYSTEM_PROMPT
      .replace(/{{problem_statement}}/gi, problemStatement)
      .replace(/{{programming_language}}/g, programmingLanguage)
      .replace(/{{topics}}/g, topics || "Not available")
      .replace(/{{hints}}/g, '\n' + hints || "No hints available");

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPromptModified
    });

    chatRef.current = model.startChat({
      generationConfig,
      history: []
    });

  }, [apiKey, modelName]);

  const getTopics = () => {
    const topicNodes = document.querySelectorAll('a[href^="/tag/"]');
    return Array.from(topicNodes).map(node => node.textContent.trim());
  };

  const getHints = () => {
    const hintNodes = document.querySelectorAll('.text-body.text-sd-foreground');

    return Array.from(hintNodes)
      .map(node => node.textContent.trim())
      .filter(text => text.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const extractedCode = extractCode(document.querySelectorAll('.view-line'))

    if (inputMessage.trim() !== '') {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }])
      setInputMessage('')
      setIsLoading(true)
      try {
        const result = await chatRef.current.sendMessage(
          inputMessage + "\n\nUser code:\n" + extractedCode
        );
        const text = result.response.text();

        setMessages(prev => [...prev, { text, sender: 'ai' }]);
        setIsLoading(false)
      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { text: "Something went wrong. Please check your API key, usage limits, and selected model availability.", sender: 'ai' }]);
        setIsLoading(false)
      }

    }
  }

  const toggleDarkMode = () => {
    // document.documentElement.classList.toggle('dark')
    setIsDarkMode(!isDarkMode)
  }

  const Loader = () => {
    const lineStyle = (width) => ({
      width: `${width}px`,
      height: "15px",
      // background: ,
      background:
        isDarkMode ? "linear-gradient(90deg,#0001 33%,#0005 50%,#0001 66%) #f2f2f2" : "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 33%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 66%) #1a1a1a",
      backgroundSize: "300% 100%",
      animation: "l1 1s infinite linear",
      borderRadius: "10px",
      marginBottom: "7px",
    });

    return (
      <div>
        <style>
          {`
          @keyframes l1 {
            0% { background-position: right; }
            100% { background-position: left; }
          }
        `}
        </style>
        <div>
          <div style={lineStyle(200)}></div>
          <div style={lineStyle(230)}></div>
          <div style={lineStyle(180)}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`position-fixed bottom-0 end-0 mb-4 me-4 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
      style={{ "backgroundColor": "white" }}
    >
      <div className={`fixed bottom-4 right-4 ${isDarkMode ? 'dark' : ''}`}>
        <style jsx>{`
  @keyframes animStar {
    from { transform: translateY(0); }
    to { transform: translateY(-135rem); }
  }
  @keyframes animStarRotate {
    from { transform: rotate(360deg); }
    to { transform: rotate(0); }
  }
  @keyframes gradient_301 {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes pulse_3011 {
    0% {
      transform: scale(0.75);
      box-shadow: 0 0 0 0 rgba(79,142,247,0.4);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(79,142,247,0);
    }
    100% {
      transform: scale(0.75);
      box-shadow: 0 0 0 0 rgba(79,142,247,0);
    }
  }

  .my-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10rem;
    overflow: hidden;
    height: 3rem;
    background-size: 300% 300%;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
    transition: 0.5s;
    animation: gradient_301 5s ease infinite;
    border: double 4px transparent;

    /* ✅ ONLY THIS GRADIENT UPDATED */
    background-image: linear-gradient(#212121, #212121), 
      linear-gradient(137.48deg, #4f8ef7 10%, #8ab4ff 45%, #2e3650 67%, #1e3566 87%);

    background-origin: border-box;
    background-clip: content-box, border-box;
    position: relative;
  }

  .my-container-stars {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.5s;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
  }

  .my-strong {
    z-index: 2;
    font-family: 'Avalors Personal Use';
    font-size: 12px;
    letter-spacing: 5px;
    color: #FFFFFF;
    text-shadow: 0 0 4px white;
  }

  .my-glow {
    position: absolute;
    display: flex;
    width: 12rem;
  }

  .my-circle {
    width: 100%;
    height: 30px;
    filter: blur(2rem);
    animation: pulse_3011 4s infinite;
    z-index: -1;
  }

  /* ✅ Glow colors updated to match blue theme */
  .my-circle:nth-of-type(1) {
    background: rgba(79,142,247,0.4);
  }

  .my-circle:nth-of-type(2) {
    background: rgba(138,180,255,0.35);
  }

  .my-btn:hover .my-container-stars {
    z-index: 1;
    background-color: #212121;
  }

  .my-btn:hover {
    transform: scale(1.1)
  }

  .my-btn:active {
    border: double 4px #4f8ef7;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: none;
  }

  .my-btn:active .my-circle {
    background: #4f8ef7;
  }

  .my-stars {
    position: relative;
    background: transparent;
    width: 200rem;
    height: 200rem;
  }

  .my-stars::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -100rem;
    width: 100%;
    height: 100%;
    animation: animStarRotate 90s linear infinite;
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
  }

  .my-stars::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 170%;
    height: 500%;
    animation: animStar 60s linear infinite;
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
    opacity: 0.5;
  }

  /* ================= TOGGLE SWITCH FIX ================= */
  .form-check-input {
    cursor: pointer;
    background-color: #2e3650 !important;
    border-color: #4f8ef7 !important;
  }

  .form-check-input:checked {
    background-color: #4f8ef7 !important;
    border-color: #4f8ef7 !important;
  }

  .form-check-input:focus {
    box-shadow: 0 0 0 2px rgba(79,142,247,0.3) !important;
    border-color: #4f8ef7 !important;
  }

  /* ================= CHAT BUBBLES ================= */
  .msg-bubble {
    padding: 10px 14px;
    border-radius: 16px;
    max-width: 75%;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: pre-wrap;
    position: relative;
    transition: all 0.2s ease;
  }

  .msg-bubble.user {
    background: linear-gradient(135deg, #4f8ef7, #1e3566);
    color: white;
    border-bottom-right-radius: 6px;
  }

  .msg-bubble.ai {
    background: #151820;
    color: #e8eaf0;
    border: 1px solid #2e3650;
    border-bottom-left-radius: 6px;
  }

  /* ================= INPUT FIELD ================= */
  .chat-input {
    border-radius: 999px !important;
    border: 1px solid #2e3650 !important;
    padding: 10px 14px;
    background-color: #0d0f14 !important;
    color: #e8eaf0 !important;
    transition: all 0.2s ease;
    outline: none !important;
    box-shadow: none !important;
  }

  .chat-input:focus {
    border-color: #4f8ef7 !important;
    box-shadow: 0 0 0 1.5px rgba(79,142,247,0.35) !important;
  }

  .chat-input::placeholder {
    color: #5c6480;
  }

  /* ================= FORCE OVERRIDE BOOTSTRAP ================= */
  input.form-control.chat-input:focus {
    box-shadow: 0 0 0 1.5px rgba(79,142,247,0.35) !important;
    border-color: #4f8ef7 !important;
  }

  /* ================= SMALL POLISH ================= */
  .msg-bubble:hover {
    transform: translateY(-1px);
  }

  :global(.dark) .my-btn {
    background-image: linear-gradient(#1a1a1a, #1a1a1a), 
      linear-gradient(137.48deg, #4f8ef7 10%, #8ab4ff 45%, #2e3650 67%, #1e3566 87%);
  }
`}</style>
        {/* linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%); */}
        <button onClick={toggleChat} className="my-btn">
          <div className="my-container-stars">
            <div className="my-stars"></div>
          </div>

          <div className="my-glow">
            <div className="my-circle"></div>
            <div className="my-circle"></div>
          </div>

          <strong className="my-strong">
            {isOpen ? <X size={24} /> : 'Ask AI'}
          </strong>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="position-absolute bottom-100 end-0 mb-4"
            style={{ backgroundColor: !isDarkMode ? "#1a1a1a" : "white" }}
          >
            <div className="card shadow" style={{ width: '24rem' }}>
              <div className="card-header d-flex justify-content-between align-items-center py-2">
                <h5 className="card-title fs-4 fw-bold mb-0">AI Chat</h5>
                <div className="d-flex align-items-center gap-2">
                  <Sun className="small" style={{ width: '1rem', height: '1rem' }} />
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                  </div>
                  <Moon className="small" style={{ width: '1rem', height: '1rem' }} />
                </div>
              </div>

              <div className={`card-body overflow-auto bg-white`} style={{ height: '24rem' }}>
                <div className="d-flex flex-column gap-3">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                      <div
                        className={`msg-bubble ${message.sender === 'user' ? 'user' : 'ai'}`}
                      // style={{ backgroundColor:message.sender === 'user'? "blue":"white",color:message.sender === 'user'? "white":"black" }}
                      >
                        {message.sender === 'ai' ? (
                          <TypewriterEffect text={message.text} />
                        ) : (
                          message.text
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && <Loader />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="card-footer">
                <form onSubmit={handleSubmit} className="d-flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="form-control chat-input"
                  />
                  {/* <button type="submit" className="btn btn-primary px-3">
                    <Send className="small" style={{ width: '1rem', height: '1rem' }} />
                    <span className="visually-hidden">Send</span>
                  </button> */}
                  <button className="my-btn" style={{ "width": "5rem" }}>
                    <div className="my-container-stars">
                      <div className="my-stars"></div>
                    </div>

                    <div className="my-glow">
                      <div className="my-circle"></div>
                      <div className="my-circle"></div>
                    </div>

                    <strong className="my-strong">
                      <Send className="small" style={{ width: '1rem', height: '1rem' }} />
                    </strong>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const index = useRef(0);

  // Function to calculate typing speed based on text length
  const getTypingSpeed = (length) => {
    if (length <= 100) return 70; // Fast for short texts
    if (length <= 300) return 30; // Medium speed for medium texts
    return 10; // Slow for long texts
  };

  const typingSpeed = getTypingSpeed(text.length);

  useEffect(() => {
    if (index.current < text.length) {
      const timeoutId = setTimeout(() => {
        // setDisplayText((value) => value + text.charAt(index.current));
        setDisplayText(displayText + text.charAt(index.current));
        index.current += 1;
      }, typingSpeed);

      return () => clearTimeout(timeoutId);
    }
  }, [displayText, text, typingSpeed]);

  return <span>{displayText}</span>;
};

const LoadingAnimation = () => (
  <div className="flex justify-center items-center space-x-2">
    <motion.div
      className="w-3 h-3 rounded-full bg-primary"
      style={{ backgroundColor: "white" }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        times: [0, 0.5, 1],
      }}
    />
    <motion.div
      className="w-3 h-3 rounded-full bg-primary"
      style={{ backgroundColor: "white" }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        times: [0, 0.5, 1],
        delay: 0.2,
      }}
    />
    <motion.div
      className="w-3 h-3 rounded-full bg-primary"
      style={{ backgroundColor: "white" }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        times: [0, 0.5, 1],
        delay: 0.4,
      }}
    />
  </div>
)

function extractCode(htmlContent) {
  // Extract the text content of each line with the 'view-line' class

  const code = Array.from(htmlContent)
    .map((line) => line.textContent || '') // Ensure textContent is not null
    .join('\n');

  return code;
}


export default ChatComponent