import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/developent-onprocess.json";
import { Link } from "react-router-dom";

const DevelopmentOnProcess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]px-4 sm:px-6 text-center">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-sm mx-auto">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mt-0 sm:mt-4">
        This Page is Under Construction
      </h2>
      <p className="text-gray-500 text-sm sm:text-base my-2">
        We're working hard to bring this feature to life. Stay tuned!
      </p>
      <Link to="/" className="bg-black text-white py-2 px-4 rounded-sm mt-2">Go Back to Home</Link>
    </div>
  );
};

export default DevelopmentOnProcess;
