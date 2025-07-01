import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/developent-onprocess.json";

const DevelopmentOnProcess = () => {
  return (
    <div className="flex flex-col items-center justify-start  bg-white px-6 text-center">
      <div className="max-w-md w-full">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-0">
        This Page is Under Development
      </h2>
      <p className="text-gray-500 text-sm md:text-base mt-2">
        We're working hard to bring this feature to life. Stay tuned!
      </p>
    </div>
  );
};

export default DevelopmentOnProcess;
