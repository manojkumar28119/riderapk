import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-700">404</h1>
      <p className="mt-4 text-lg text-gray-600">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/signin"
        className="mt-6 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
