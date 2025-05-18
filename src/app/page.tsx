"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white transition-colors duration-300">
      <div className="text-center px-6">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          <TypeAnimation
            sequence={["Welcome to Anonymous Feedback", 2000, "", 1000]}
            wrapper="span"
            speed={60}
            repeat={Infinity}
          />
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8">
          Share your honest opinions anonymously. Simple. Safe. Secure.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => router.replace("/admin/dashboard")}
          >
            Get Feedback
          </button>
          <button
            className="px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => router.replace("/products")}
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
