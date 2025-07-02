import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/developent-onprocess.json";

const DevelopmentOnProcess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-4 sm:px-6 text-center">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-2 sm:mt-4">
        This Page is Under Development
      </h2>
      <p className="text-gray-500 text-sm sm:text-base mt-2">
        We're working hard to bring this feature to life. Stay tuned!
      </p>
    </div>
  );
};

export default DevelopmentOnProcess;
