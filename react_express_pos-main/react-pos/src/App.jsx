import { Navber } from "./components/Navber";
import { HomePage } from "./components/Homepage";

import { useIsAuthenticated } from "@azure/msal-react";

import { useMsal } from '@azure/msal-react';
import { MsalProvider } from "@azure/msal-react";
import { useEffect } from "react";
import { Login } from "./components/Login";
function App() {
  
  const isAuthenticated = useIsAuthenticated();
  // const msalInstance = props.msalInstance;
    

  console.log(isAuthenticated,'isAuthenticated')

  return (
    // <MsalProvider   instance={msalInstance}>
    //       <Navber />
    //       <HomePage />
    // </MsalProvider>

    <>
      {isAuthenticated ?(
        <>
          <Navber />
          <HomePage />
        </>
      ): <Login/>}
    </>
  );
}

export default App;

// App.jsx
// import React, { useEffect } from 'react';
// import { Navber } from "./components/Navber";
// import { HomePage } from "./components/Homepage";
// import { useIsAuthenticated, useMsal } from "@azure/msal-react";

// function App() {
//   const isAuthenticated = useIsAuthenticated();
//   const { instance } = useMsal();

//   console.log(isAuthenticated,'isAuthenticated')
  
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const currentAccount = instance.getActiveAccount();
//       console.log('Current Auth Status:', {
//         isAuthenticated,
//         currentAccount,
//         allAccounts: instance.getAllAccounts()
//       });
//     };

//     checkAuthStatus();
//   }, [isAuthenticated, instance]);

//   return (
//     <>
//       <Navber />
//       <HomePage />
//     </>
//   );
// }

// export default App;