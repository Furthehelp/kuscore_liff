"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../actions/auth";
import { useRouter } from "next/navigation";

function Verify() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const token = router.query?.token;

  useEffect(() => {
    if (token) {
      auth(token)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setMessage(data.message);
          }
        })
        .catch((error) => {
          console.error(error.message);
          setError(
            error.message || "An error occurred while processing your request"
          );
        });
    } else {
      setError("Invalid token");
    }
  }, [token]);

  return (
    <>
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
            <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
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
    </>
  );
}

export default Verify;
