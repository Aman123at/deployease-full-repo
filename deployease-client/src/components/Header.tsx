import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContextProvider";
import axios from "axios";
import CreateProjectModal from "./CreateProjectModal";

const Header: React.FC<{ isUserLoggedIn?: boolean }> = ({ isUserLoggedIn }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("dark");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark", JSON.stringify(true));
    }
  };

  useEffect(() => {
    const dark = localStorage.getItem("dark");
    if (dark) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);
  const isLogPage = () => window.location.pathname === "/logs";
  const isDashboardPage = () => window.location.pathname === "/dashboard";

  const { setUser } = useAuthContext();
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:9000/api/user/logout",
        {},
        { withCredentials: true }
      );
      setUser!(null);
    } catch (error) {
      console.log("Logout Error : Error in logout ", error);
    }
  };
  const modal: HTMLDialogElement | null = document.getElementById('modal') as HTMLDialogElement;

  return (
    <header className="bg-white dark:bg-gray-800 shadow w-full">
      <CreateProjectModal />
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48px"
            height="48px"
          >
            <rect x="3" y="3" width="18" height="6" rx="1" fill="#007BFF" />
            <circle cx="7" cy="6" r="1.5" fill="#FFFFFF" />
            <rect x="3" y="9" width="18" height="6" rx="1" fill="#28A745" />
            <circle cx="7" cy="12" r="1.5" fill="#FFFFFF" />
            <rect x="3" y="15" width="18" height="6" rx="1" fill="#FFC107" />
            <circle cx="7" cy="18" r="1.5" fill="#FFFFFF" />
          </svg>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-sans ml-2">
            DeployEase
          </h1>
          {isUserLoggedIn && isLogPage() && (
            <p onClick={(e)=>{
              e.stopPropagation()  // To prevent event bubbling
              navigate('/dashboard')}} className="ml-5 text-blue-400 underline hover:text-blue-600 cursor-pointer">
              dashboard
            </p>
          )}
        </div>

        <div className="flex items-center">
          {isDashboardPage() &&
          <button
            className="inline-block align-baseline border dark:border-gray-300 border-black px-3 rounded py-1 mx-2 dark:hover:bg-slate-600 hover:bg-gray-300 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800"
            type="button"
            onClick={()=> modal.showModal()}
            
          >
            + Create Project
          </button>
          }
          <button
            className="flex items-center align-baseline border dark:border-gray-300 border-black px-3 rounded py-1 mx-5 dark:hover:bg-slate-600 hover:bg-gray-300 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 "
            type="button"
            onClick={isUserLoggedIn ? handleLogout : () => navigate("/auth")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff0000" className="size-4 mr-2">
              <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
            </svg>
            {isUserLoggedIn ? "Logout" : "Login"}
          </button>
          <div className=" flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>

              <label
                htmlFor="dark-mode-toggle"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  className="sr-only"
                  onChange={toggleDarkMode}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-600">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 dark:translate-x-5 dark:bg-yellow-500"></div>
                </div>
              </label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
