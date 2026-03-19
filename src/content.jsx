// import "./index.css";

// import { createRoot } from "react-dom/client";
// import { StrictMode } from "react";
// // import {}
// const root = document.createElement("div");
// root.id = "ai_assistant";
// document.body.append(root);

// createRoot(root).render(
//   <StrictMode>
//     <div className="App">
//       <h1>Hello CodeBuddy</h1>
//     </div>
//   </StrictMode>
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatComponent from './chatComponent';

const root = document.createElement('div');
root.id = 'codebuddy';

// Attach a Shadow DOM to the root
const shadowRoot = root.attachShadow({ mode: 'open' });
document.body.appendChild(root);

// Create a container inside the Shadow DOM for React
const shadowContainer = document.createElement('div');
shadowContainer.style.zIndex = 1000000000000
shadowRoot.appendChild(shadowContainer);

// Function to inject Bootstrap CSS and Icons into the Shadow DOM
function injectStylesIntoShadow(shadowRoot) {
  // Add Bootstrap CSS
  const bootstrapCSS = document.createElement('link');
  bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
  bootstrapCSS.rel = "stylesheet";
  shadowRoot.appendChild(bootstrapCSS);

  // Add Bootstrap Icons
  const bootstrapIcons = document.createElement('link');
  bootstrapIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
  
  bootstrapIcons.rel = "stylesheet";
  
  document.body.appendChild(bootstrapIcons);
}

// Inject styles into the Shadow DOM
injectStylesIntoShadow(shadowRoot);

// Inject your React app into the shadowContainer
// if(sessionStorage.getItem("API_KEY") != null){
// }
createRoot(shadowContainer).render(<ChatComponent />);
