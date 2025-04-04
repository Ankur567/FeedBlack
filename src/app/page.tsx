"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-indigo-950">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4">
          <TypeAnimation
            sequence={["Welcome to Anonymous Feedback", 1000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </h1>
        <p className="text-xl text-gray-400">
          Share your thoughts freely and securely.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
