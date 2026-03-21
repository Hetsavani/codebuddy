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
      .replace(/{{hints}}/g, '\n'+hints || "No hints available");

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
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
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
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          100% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
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
          background-image: linear-gradient(#212121, #212121), 
            linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
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

        .my-circle:nth-of-type(1) {
          background: rgba(254, 83, 186, 0.636);
        }

        .my-circle:nth-of-type(2) {
          background: rgba(142, 81, 234, 0.704);
        }

        .my-btn:hover .my-container-stars {
          z-index: 1;
          background-color: #212121;
        }

        .my-btn:hover {
          transform: scale(1.1)
        }

        .my-btn:active {
          border: double 4px #FE53BB;
          background-origin: border-box;
          background-clip: content-box, border-box;
          animation: none;
        }

        .my-btn:active .my-circle {
          background: #FE53BB;
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

        :global(.dark) .my-btn {
          background-image: linear-gradient(#1a1a1a, #1a1a1a), 
            linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
        }
      `}</style>
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
                        className={`p-3 rounded-3 mw-75 ${message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-light'
                          }`}
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
                    className="form-control"
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

// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Moon, Sun, Send, X } from 'lucide-react'
// import { GoogleGenerativeAI } from '@google/generative-ai'
// import { SYSTEM_PROMPT } from './constants/prompt'
// const ChatComponent = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([])
//   const [inputMessage, setInputMessage] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [isDarkMode, setIsDarkMode] = useState(false)
//   const chatRef = useRef(null)
//   const messagesEndRef = useRef(null)
//   const [typedMessageIndex, setTypedMessageIndex] = useState(null)
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false)

//   const programmingLanguage = 'no data - detect from code' // Or get this from your app's state/props

//   const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 64,
//     maxOutputTokens: 8192,
//     responseMimeType: "text/plain",
//   };

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // Handle typing effect only for latest message on reopen
//   useEffect(() => {
//     if (isOpen && !initialLoadComplete && messages.length > 0) {
//       const lastMessage = messages[messages.length - 1]
//       if (lastMessage.sender === 'ai') {
//         setTypedMessageIndex(messages.length - 1)
//       }
//       setInitialLoadComplete(true)
//     } else if (!isOpen) {
//       setInitialLoadComplete(false)
//     }
//   }, [isOpen, initialLoadComplete, messages])

//   const toggleChat = () => setIsOpen(!isOpen)

//   const handleInputChange = (e) => setInputMessage(e.target.value)
//   const [apiKey, setApiKey] = useState("");
//   const [modelName, setModelName] = useState("");
//   // const api_key = localStorage.getItem('codebuddy_api_key');
//   // const api_key = chrome.storage.getItem('codebuddy_api_key');
//   // const model_name = localStorage.getItem('codebuddy_model');

//   // chrome.storage.local.get(["codebuddy_api_key", "codebuddy_model"], (res) => {
//   //   console.log("Loaded API Key:", res.codebuddy_api_key);
//   //   console.log("Loaded Model:", res.codebuddy_model);
//   //   if (res.codebuddy_api_key) {
//   //     setApiKey(res.codebuddy_api_key);
//   //   }
//   //   if (res.codebuddy_model) {
//   //     setModelName(res.codebuddy_model);
//   //   }
//   // });
//   useEffect(() => {
//     if (typeof chrome !== "undefined" && chrome?.storage?.local) {
//       chrome.storage.local.get(
//         ["codebuddy_api_key", "codebuddy_model"],
//         (res) => {
//           if (res.codebuddy_api_key) {
//             setApiKey(res.codebuddy_api_key);
//           }
//           if (res.codebuddy_model) {
//             setModelName(res.codebuddy_model);
//           }
//         }
//       );
//     }
//   }, []);

//   const genAI = new GoogleGenerativeAI(apiKey);
//   useEffect(() => {
//     if (!apiKey || !modelName) return; // ⛔ wait until values loaded

//     const genAI = new GoogleGenerativeAI(apiKey);

//     const metaDescriptionEl = document.querySelector('meta[name=description]');
//     const problemStatement = metaDescriptionEl?.getAttribute('content') || '';

//     const systemPromptModified = SYSTEM_PROMPT
//       .replace(/{{problem_statement}}/gi, problemStatement)
//       .replace(/{{programming_language}}/g, programmingLanguage);

//     const model = genAI.getGenerativeModel({
//       model: modelName,
//       systemInstruction: systemPromptModified
//     });

//     chatRef.current = model.startChat({
//       generationConfig,
//       history: []
//     });

//     // codeRef.current = ;

//     console.log("✅ Initialized with:", modelName);

//   }, [apiKey, modelName]);

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const extractedCode = extractCode(document.querySelectorAll('.view-line'))

//     if (inputMessage.trim() !== '') {
//       setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }])
//       setInputMessage('')
//       setIsLoading(true)
//       try {
//         const result = await chatRef.current.sendMessage(
//           inputMessage + "\n\nUser code:\n" + extractedCode
//         );
//         const text = result.response.text();

//         setMessages(prev => {
//           const newMessages = [...prev, { text, sender: 'ai' }]
//           setTypedMessageIndex(newMessages.length - 1)
//           return newMessages
//         });
//         setIsLoading(false)
//       } catch (err) {
//         console.error(err);
//         setMessages(prev => {
//           const newMessages = [...prev, { text: "Something went wrong. Please check your API key, usage limits, and selected model availability.", sender: 'ai' }]
//           setTypedMessageIndex(newMessages.length - 1)
//           return newMessages
//         });
//         setIsLoading(false)
//       }

//     }
//   }

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode)
//     document.documentElement.classList.toggle('dark')
//   }

//   const Loader = () => {
//     const lineStyle = (width) => ({
//       width: `${width}px`,
//       height: "15px",
//       // background: ,
//       background:
//         isDarkMode ? "linear-gradient(90deg,#0001 33%,#0005 50%,#0001 66%) #f2f2f2" : "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 33%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 66%) #1a1a1a",
//       backgroundSize: "300% 100%",
//       animation: "l1 1s infinite linear",
//       borderRadius: "10px",
//       marginBottom: "7px",
//     });

//     return (
//       <div>
//         <style>
//           {`
//           @keyframes l1 {
//             0% { background-position: right; }
//             100% { background-position: left; }
//           }
//         `}
//         </style>
//         <div>
//           <div style={lineStyle(200)}></div>
//           <div style={lineStyle(230)}></div>
//           <div style={lineStyle(180)}></div>
//         </div>
//       </div>
//     );
//   };

//   const styles = `
//     @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;800&display=swap');

//     :root {
//       --bg:         #0d0f14;
//       --surface:    #151820;
//       --border:     #1f2433;
//       --border-hi:  #2e3650;
//       --accent:     #4f8ef7;
//       --accent-dim: #1e3566;
//       --accent-glow:rgba(79,142,247,0.18);
//       --green:      #3dffa0;
//       --red:        #ff5b5b;
//       --text:       #e8eaf0;
//       --muted:      #5c6480;
//       --radius:     10px;
//     }

//     .chat-container {
//       font-family: 'Syne', sans-serif;
//       position: fixed;
//       bottom: 16px;
//       right: 16px;
//       z-index: 999999;
//       pointer-events: none;
//     }

//     .chat-container > * {
//       pointer-events: auto;
//     }

//     .chat-window {
//       background: var(--bg);
//       border: 1px solid var(--border);
//       border-radius: var(--radius);
//       box-shadow: 0 20px 60px rgba(0,0,0,0.8);
//       position: relative;
//       overflow: hidden;
//       width: 380px;
//     }

//     .chat-window::before {
//       content: '';
//       position: absolute;
//       top: -60px; right: -60px;
//       width: 220px; height: 220px;
//       background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
//       pointer-events: none;
//       z-index: 0;
//     }

//     .chat-header {
//       background: var(--surface);
//       border-bottom: 1px solid var(--border);
//       padding: 14px 16px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       position: relative;
//       z-index: 2;
//     }

//     .chat-title {
//       font-size: 15px;
//       font-weight: 800;
//       color: var(--text);
//       margin: 0;
//       letter-spacing: -0.3px;
//     }

//     .chat-controls {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .chat-controls svg {
//       color: var(--accent) !important;
//     }

//     .chat-toggle {
//       width: 36px;
//       height: 20px;
//       background: var(--border-hi);
//       border: 1px solid var(--border);
//       border-radius: 10px;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       padding: 2px;
//       transition: background 0.3s;
//       position: relative;
//     }

//     .chat-toggle.active {
//       background: var(--accent);
//     }

//     .chat-toggle::after {
//       content: '';
//       width: 16px;
//       height: 16px;
//       background: white;
//       border-radius: 8px;
//       transition: transform 0.3s;
//     }

//     .chat-toggle.active::after {
//       transform: translateX(16px);
//     }

//     .chat-messages {
//       height: 360px;
//       overflow-y: auto;
//       padding: 16px;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       background: var(--bg);
//       position: relative;
//       z-index: 1;
//     }

//     .chat-messages::-webkit-scrollbar {
//       width: 6px;
//     }

//     .chat-messages::-webkit-scrollbar-track {
//       background: var(--surface);
//       border-radius: 3px;
//     }

//     .chat-messages::-webkit-scrollbar-thumb {
//       background: var(--border-hi);
//       border-radius: 3px;
//     }

//     .chat-messages::-webkit-scrollbar-thumb:hover {
//       background: var(--accent);
//     }

//     .message {
//       display: flex;
//       gap: 8px;
//       animation: slideUp 0.3s ease-out;
//     }

//     @keyframes slideUp {
//       from {
//         opacity: 0;
//         transform: translateY(10px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }

//     .message.user {
//       justify-content: flex-end;
//     }

//     .message-bubble {
//       padding: 12px 14px;
//       border-radius: 12px;
//       max-width: 85%;
//       word-wrap: break-word;
//       font-size: 13px;
//       line-height: 1.5;
//       font-family: 'JetBrains Mono', monospace;
//     }

//     .message.user .message-bubble {
//       background: linear-gradient(135deg, #3d6dcc 0%, #2456a0 100%);
//       color: #ffffff;
//       border: 1px solid rgba(79,142,247,0.4);
//       box-shadow: 0 4px 12px rgba(79,142,247,0.3);
//       font-weight: 500;
//     }

//     .message.ai .message-bubble {
//       background: var(--surface);
//       color: var(--text);
//       border: 1px solid var(--border-hi);
//     }

//     .chat-footer {
//       background: var(--surface);
//       border-top: 1px solid var(--border);
//       padding: 12px 16px;
//       position: relative;
//       z-index: 2;
//     }

//     .chat-input-form {
//       display: flex;
//       gap: 8px;
//     }

//     .chat-input {
//       flex: 1;
//       background: var(--bg);
//       border: 1px solid var(--border-hi);
//       border-radius: 7px;
//       padding: 9px 12px;
//       color: var(--text);
//       font-family: 'JetBrains Mono', monospace;
//       font-size: 12px;
//       outline: none;
//       transition: border-color 0.2s, box-shadow 0.2s;
//     }

//     .chat-input:focus {
//       border-color: var(--accent);
//       box-shadow: 0 0 0 3px var(--accent-glow);
//     }

//     .chat-input::placeholder {
//       color: var(--muted);
//     }

//     .loader {
//       display: flex;
//       flex-direction: column;
//       gap: 7px;
//     }

//     .loader-line {
//       height: 15px;
//       background: linear-gradient(90deg, rgba(79,142,247,0.1) 33%, rgba(79,142,247,0.3) 50%, rgba(79,142,247,0.1) 66%) #151820;
//       background-size: 300% 100%;
//       animation: l1 1s infinite linear;
//       border-radius: 10px;
//     }

//     @keyframes l1 {
//       0% { background-position: right; }
//       100% { background-position: left; }
//     }
//   `

//   return (
//     <div className="chat-container" style={{ pointerEvents: 'none' }}>
//       <style>{styles}</style>
//       <style jsx>{`
//         @keyframes animStar {
//           from { transform: translateY(0); }
//           to { transform: translateY(-135rem); }
//         }
//         @keyframes animStarRotate {
//           from { transform: rotate(360deg); }
//           to { transform: rotate(0); }
//         }
//         @keyframes gradient_301 {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         @keyframes pulse_3011 {
//           0% {
//             transform: scale(0.75);
//             box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
//           }
//           70% {
//             transform: scale(1);
//             box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
//           }
//           100% {
//             transform: scale(0.75);
//             box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
//           }
//         }

//         .my-btn {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           width: 10rem;
//           overflow: hidden;
//           height: 3rem;
//           background-size: 300% 300%;
//           backdrop-filter: blur(1rem);
//           border-radius: 5rem;
//           transition: 0.5s;
//           animation: gradient_301 5s ease infinite;
//           border: double 3px transparent;
//           background-image: linear-gradient(#0d0f14, #0d0f14), 
//             linear-gradient(135deg, #4f8ef7 0%, #2d5aa8 100%);
//           background-origin: border-box;
//           background-clip: content-box, border-box;
//           position: relative;
//           cursor: pointer;
//         }

//         .my-container-stars {
//           position: absolute;
//           z-index: -1;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//           transition: 0.5s;
//           backdrop-filter: blur(1rem);
//           border-radius: 5rem;
//         }

//         .my-strong {
//           z-index: 2;
//           font-family: 'Syne', sans-serif;
//           font-size: 13px;
//           font-weight: 600;
//           letter-spacing: 0px;
//           color: #FFFFFF;
//           text-shadow: 0 0 2px rgba(79,142,247,0.5);
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .my-glow {
//           position: absolute;
//           display: flex;
//           width: 12rem;
//         }

//         .my-circle {
//           width: 100%;
//           height: 30px;
//           filter: blur(2rem);
//           animation: pulse_3011 4s infinite;
//           z-index: -1;
//         }

//         .my-circle:nth-of-type(1) {
//           background: rgba(79, 142, 247, 0.4);
//         }

//         .my-circle:nth-of-type(2) {
//           background: rgba(79, 142, 247, 0.3);
//         }

//         .my-btn:hover .my-container-stars {
//           z-index: 1;
//           background-color: #151820;
//         }

//         .my-btn:hover {
//           transform: scale(1.05);
//           border-image: linear-gradient(135deg, #6fa8ff 0%, #3d6dcc 100%) 1;
//         }

//         .my-btn:active {
//           border: double 3px #4f8ef7;
//           background-origin: border-box;
//           background-clip: content-box, border-box;
//           animation: none;
//         }

//         .my-btn:active .my-circle {
//           background: #4f8ef7;
//         }

//         .my-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .my-stars {
//           position: relative;
//           background: transparent;
//           width: 200rem;
//           height: 200rem;
//         }

//         .my-stars::after {
//           content: "";
//           position: absolute;
//           top: -10rem;
//           left: -100rem;
//           width: 100%;
//           height: 100%;
//           animation: animStarRotate 90s linear infinite;
//           background-image: radial-gradient(#ffffff 0.5px, transparent 1%);
//           background-size: 50px 50px;
//           opacity: 0.3;
//         }

//         .my-stars::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: -50%;
//           width: 170%;
//           height: 500%;
//           animation: animStar 60s linear infinite;
//           background-image: radial-gradient(#ffffff 0.5px, transparent 1%);
//           background-size: 50px 50px;
//           opacity: 0.2;
//         }

//         :global(.dark) .my-btn {
//           background-image: linear-gradient(#0d0f14, #0d0f14), 
//             linear-gradient(135deg, #4f8ef7 0%, #2d5aa8 100%);
//         }
//       `}</style>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             style={{ 
//               position: 'fixed', 
//               bottom: '120px', 
//               right: '16px',
//               zIndex: 999998,
//               pointerEvents: 'auto'
//             }}
//           >
//             <div className="chat-window">
//               <div className="chat-header">
//                 <h5 className="chat-title">CodeBuddy Chat</h5>
//                 <div className="chat-controls">
//                   <Sun size={16} style={{ color: 'var(--muted)' }} />
//                   <div className={`chat-toggle ${isDarkMode ? 'active' : ''}`} onClick={toggleDarkMode} />
//                   <Moon size={16} style={{ color: 'var(--muted)' }} />
//                 </div>
//               </div>

//               <div className="chat-messages">
//                 {messages.length === 0 && (
//                   <div style={{ color: 'var(--muted)', textAlign: 'center', margin: 'auto', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
//                     Start a conversation... Het
//                   </div>
//                 )}
//                 {messages.map((message, index) => (
//                   <div key={index} className={`message ${message.sender}`}>
//                     <div className="message-bubble">
//                       {message.sender === 'ai' && index === typedMessageIndex ? (
//                         <TypewriterEffect text={message.text} />
//                       ) : (
//                         message.text
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 {isLoading && (
//                   <div className="message ai">
//                     <div className="message-bubble" style={{ padding: '8px 12px' }}>
//                       <div className="loader">
//                         <div className="loader-line" style={{ width: '200px' }} />
//                         <div className="loader-line" style={{ width: '230px' }} />
//                         <div className="loader-line" style={{ width: '180px' }} />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="chat-footer">
//                 <form onSubmit={handleSubmit} className="chat-input-form">
//                   <input
//                     type="text"
//                     value={inputMessage}
//                     onChange={handleInputChange}
//                     placeholder="Ask anything..."
//                     className="chat-input"
//                     disabled={isLoading}
//                   />
//                   <button className="my-btn" style={{ width: '4.5rem', height: '2.4rem' }} type="submit" disabled={isLoading || !inputMessage.trim()}>
//                     <div className="my-container-stars">
//                       <div className="my-stars"></div>
//                     </div>
//                     <div className="my-glow">
//                       <div className="my-circle"></div>
//                       <div className="my-circle"></div>
//                     </div>
//                     <strong className="my-strong" style={{ fontSize: '10px' }}>
//                       <Send size={14} />
//                     </strong>
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.div
//         style={{ 
//           position: 'fixed', 
//           bottom: '16px', 
//           right: '16px',
//           zIndex: 999999,
//           pointerEvents: 'auto'
//         }}
//         className={isDarkMode ? 'dark' : ''}
//       >
//         <style jsx>{`
//           @keyframes animStar {
//             from { transform: translateY(0); }
//             to { transform: translateY(-135rem); }
//           }
//           @keyframes animStarRotate {
//             from { transform: rotate(360deg); }
//             to { transform: rotate(0); }
//           }
//           @keyframes gradient_301 {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//           }
//           @keyframes pulse_3011 {
//             0% {
//               transform: scale(0.75);
//               box-shadow: 0 0 0 0 rgba(79, 142, 247, 0.5);
//             }
//             70% {
//               transform: scale(1);
//               box-shadow: 0 0 0 10px rgba(79, 142, 247, 0);
//             }
//             100% {
//               transform: scale(0.75);
//               box-shadow: 0 0 0 0 rgba(79, 142, 247, 0);
//             }
//           }

//           .my-btn-main {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             width: 10rem;
//             overflow: hidden;
//             height: 3rem;
//             background-size: 300% 300%;
//             backdrop-filter: blur(1rem);
//             border-radius: 5rem;
//             transition: 0.5s;
//             animation: gradient_301 5s ease infinite;
//             border: double 3px transparent;
//             background-image: linear-gradient(#0d0f14, #0d0f14), 
//               linear-gradient(135deg, #4f8ef7 0%, #2d5aa8 100%);
//             background-origin: border-box;
//             background-clip: content-box, border-box;
//             position: relative;
//             cursor: pointer;
//           }

//           .my-container-stars-main {
//             position: absolute;
//             z-index: -1;
//             width: 100%;
//             height: 100%;
//             overflow: hidden;
//             transition: 0.5s;
//             backdrop-filter: blur(1rem);
//             border-radius: 5rem;
//           }

//           .my-strong-main {
//             z-index: 2;
//             font-family: 'Syne', sans-serif;
//             font-size: 13px;
//             font-weight: 600;
//             letter-spacing: 0px;
//             color: #FFFFFF;
//             text-shadow: 0 0 2px rgba(79,142,247,0.5);
//           }

//           .my-glow-main {
//             position: absolute;
//             display: flex;
//             width: 12rem;
//           }

//           .my-circle-main {
//             width: 100%;
//             height: 30px;
//             filter: blur(2rem);
//             animation: pulse_3011 4s infinite;
//             z-index: -1;
//           }

//           .my-circle-main:nth-of-type(1) {
//             background: rgba(79, 142, 247, 0.4);
//           }

//           .my-circle-main:nth-of-type(2) {
//             background: rgba(79, 142, 247, 0.3);
//           }

//           .my-btn-main:hover .my-container-stars-main {
//             z-index: 1;
//             background-color: #151820;
//           }

//           .my-btn-main:hover {
//             transform: scale(1.05);
//             border-image: linear-gradient(135deg, #6fa8ff 0%, #3d6dcc 100%) 1;
//           }

//           .my-btn-main:active {
//             border: double 3px #4f8ef7;
//             background-origin: border-box;
//             background-clip: content-box, border-box;
//             animation: none;
//           }

//           .my-btn-main:active .my-circle-main {
//             background: #4f8ef7;
//           }

//           .my-stars-main {
//             position: relative;
//             background: transparent;
//             width: 200rem;
//             height: 200rem;
//           }

//           .my-stars-main::after {
//             content: "";
//             position: absolute;
//             top: -10rem;
//             left: -100rem;
//             width: 100%;
//             height: 100%;
//             animation: animStarRotate 90s linear infinite;
//             background-image: radial-gradient(#ffffff 0.5px, transparent 1%);
//             background-size: 50px 50px;
//             opacity: 0.3;
//           }

//           .my-stars-main::before {
//             content: "";
//             position: absolute;
//             top: 0;
//             left: -50%;
//             width: 170%;
//             height: 500%;
//             animation: animStar 60s linear infinite;
//             background-image: radial-gradient(#ffffff 0.5px, transparent 1%);
//             background-size: 50px 50px;
//             opacity: 0.2;
//           }
//         `}</style>
//         <button onClick={toggleChat} className="my-btn-main">
//           <div className="my-container-stars-main">
//             <div className="my-stars-main"></div>
//           </div>

//           <div className="my-glow-main">
//             <div className="my-circle-main"></div>
//             <div className="my-circle-main"></div>
//           </div>

//           <strong className="my-strong-main">
//             {isOpen ? <X size={20} /> : 'Ask AI'}
//           </strong>
//         </button>
//       </motion.div>
//     </div>
//   )
// }

// const TypewriterEffect = ({ text }) => {
//   const [displayText, setDisplayText] = useState('');
//   const indexRef = useRef(0);

//   // Function to calculate typing speed based on text length
//   const getTypingSpeed = (length) => {
//     if (length <= 100) return 50; // Fast for short texts
//     if (length <= 300) return 20; // Medium speed for medium texts
//     return 8; // Slow for long texts
//   };

//   const typingSpeed = getTypingSpeed(text.length);

//   useEffect(() => {
//     indexRef.current = 0;
//     setDisplayText('');
//   }, [text]);

//   useEffect(() => {
//     if (indexRef.current < text.length) {
//       const timeoutId = setTimeout(() => {
//         setDisplayText(prev => prev + text.charAt(indexRef.current));
//         indexRef.current += 1;
//       }, typingSpeed);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [displayText, text, typingSpeed]);

//   return <span>{displayText}</span>;
// };

// const LoadingAnimation = () => (
//   <div className="flex justify-center items-center space-x-2">
//     <motion.div
//       className="w-3 h-3 rounded-full bg-primary"
//       style={{ backgroundColor: "white" }}
//       animate={{
//         scale: [1, 1.2, 1],
//         opacity: [1, 0.5, 1],
//       }}
//       transition={{
//         duration: 1,
//         repeat: Infinity,
//         repeatType: "loop",
//         times: [0, 0.5, 1],
//       }}
//     />
//     <motion.div
//       className="w-3 h-3 rounded-full bg-primary"
//       style={{ backgroundColor: "white" }}
//       animate={{
//         scale: [1, 1.2, 1],
//         opacity: [1, 0.5, 1],
//       }}
//       transition={{
//         duration: 1,
//         repeat: Infinity,
//         repeatType: "loop",
//         times: [0, 0.5, 1],
//         delay: 0.2,
//       }}
//     />
//     <motion.div
//       className="w-3 h-3 rounded-full bg-primary"
//       style={{ backgroundColor: "white" }}
//       animate={{
//         scale: [1, 1.2, 1],
//         opacity: [1, 0.5, 1],
//       }}
//       transition={{
//         duration: 1,
//         repeat: Infinity,
//         repeatType: "loop",
//         times: [0, 0.5, 1],
//         delay: 0.4,
//       }}
//     />
//   </div>
// )

// function extractCode(htmlContent) {
//   // Extract the text content of each line with the 'view-line' class
  
//   const code = Array.from(htmlContent)
//     .map((line) => line.textContent || '') // Ensure textContent is not null
//     .join('\n');

//   return code;
// }


// export default ChatComponent
