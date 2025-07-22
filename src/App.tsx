import React from "react";
import { AuroraText } from "./components/lightswind/aurora-text-effect";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black relative">
      {/* Aurora Text */}
      <AuroraText text="Sorry Teju I love you 💖" />

      {/* Below Text */}
      <p className="text-pink-400 text-lg mt-6 z-10">
        🌸 You are my favorite person 🌸
      </p>
      
    </div>
  );
};

export default App;
