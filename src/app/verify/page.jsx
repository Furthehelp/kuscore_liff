"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../actions/auth";

function Verify() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const handleVerification = async () => {
      setIsLoading(true); // Set loading state on start
      try {
        const data = await auth(); // Call server action
        setMessage(data.message); // Update message on success
      } catch (error) {
        console.error(error.message);
        const errorMessage = error.message.includes(
          "Invalid or expired confirmation token"
        )
          ? "Invalid or expired token"
          : "An error occurred while processing your request";
        setError(errorMessage); // Set specific error message
      } finally {
        setIsLoading(false); // Clear loading state after completion
      }
    };

    handleVerification(); // Call verification on mount
  }, []);

  return (
    <>
      {isLoading && ( // Display loading indicator while verifying
        <div>Verifying your account...</div>
      )}
      {!isLoading && (
        <div
          style={{
            backgroundImage: "url('header.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div className="container mx-auto flex flex-wrap flex-col items-center">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center text-center text-green-400 font-bold text-3xl md:text-5xl">
                KU
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                  Score
                </span>
              </h1>
            </div>

            <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col items-center">
              <div className="flex flex-col w-full justify-center overflow-y-hidden">
                <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center ">
                  {error && <p>{error}</p>}
                  {message && message}{" "}
                  {message && (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                      successfully!
                    </span>
                  )}
                </h1>
              </div>

              <div className="w-full pt-16 pb-6 text-sm text-center fade-in text-white opacity-75">
                &copy; {new Date().getFullYear()} KUScore All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Verify;
