import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import { store } from "./store.js";
import { Provider } from "react-redux";
import { MsalProvider } from "@azure/msal-react";

import { useMsal } from '@azure/msal-react';


// login using  azure 
import { PublicClientApplication,EventType } from '@azure/msal-browser';

const pca = new PublicClientApplication({
  auth:{
      clientId: '14972a23-5cc8-4204-84ac-f2c1dad0c504',
      authority: 'https://login.microsoftonline.com/324a7ccc-f7db-4150-9c4f-eeec74662c4a',
      redirectUri: '/',
  }
})

pca.addEventCallback(event => {
  if(event.eventType === EventType.LOGIN_SUCCESS ){
      console.log(event.eventType,'event.eventType')
      pca.setActiveAccount(event.payload.account)
  }
})



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <MsalProvider   instance={pca}>
    <Provider store={store}>
        <App  />
      </Provider>
    </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>,
)


// main.jsx
// import { 
//   PublicClientApplication,
//   EventType, 
//   LogLevel 
// } from '@azure/msal-browser';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from "react-redux";
// import { store } from "./store.js";
// import { MsalProvider } from "@azure/msal-react";

// // MSAL configuration
// const msalConfig = {
//   auth: {
//     clientId: '14972a23-5cc8-4204-84ac-f2c1dad0c504',
//     authority: 'https://login.microsoftonline.com/324a7ccc-f7db-4150-9c4f-eeec74662c4a',
//     redirectUri: window.location.origin,
//   },
//   cache: {
//     cacheLocation: 'sessionStorage', // เปลี่ยนเป็น sessionStorage แทน localStorage
//     storeAuthStateInCookie: true // เพิ่มการใช้ cookie สำหรับ IE11
//   }
// };

// // Create MSAL instance
// const msalInstance = new PublicClientApplication(msalConfig);

// // Ensure the instance is initialized before rendering
// const beforeAppRender = async () => {
//   await msalInstance.initialize();
  
//   // Handle the redirect flow
//   try {
//     const response = await msalInstance.handleRedirectPromise();
//     if (response) {
//       // If we have a response, user is returning from authentication
//       console.log('Login success response:', response);
//       msalInstance.setActiveAccount(response.account);
//     }
//   } catch (error) {
//     console.error('Error during redirect handling:', error);
//   }
  
//   // Register callback for login success
//   msalInstance.addEventCallback((event) => {
//     if (event.eventType === EventType.LOGIN_SUCCESS) {
//       console.log('Login Success Event:', event);
//       if (event.payload.account) {
//         msalInstance.setActiveAccount(event.payload.account);
//       }
//     }
//   });

//   // Render the application
//   const root = ReactDOM.createRoot(document.getElementById('root'));
//   root.render(
//     <React.StrictMode>
//       <BrowserRouter>
//         <Provider store={store}>
//           <MsalProvider instance={msalInstance}>
//             <App />
//           </MsalProvider>
//         </Provider>
//       </BrowserRouter>
//     </React.StrictMode>
//   );
// };

// // Start the application
// beforeAppRender().catch(error => {
//   console.error('Error during app initialization:', error);
// });