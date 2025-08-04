import { useState, useEffect } from "react";

import "./App.css";
import { apiClient } from "@limlim-ai/core";

function App() {
  const [message, setMessage] = useState("loading...");

  useEffect(() => {
    apiClient
      .get("/hello")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error: Error) => {
        console.error("Error fetching data:", error);
        setMessage("Failed to load message from server.");
      });
  }, []);

  return <>{message}</>;
}

export default App;
