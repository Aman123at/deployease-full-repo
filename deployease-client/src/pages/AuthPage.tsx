// src/AuthPage.js
import { FormEvent, useEffect, useState } from "react";
import Header from "../components/Header";
import {
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import {
  ISignInErrorFormState,
  ISignInFormState,
  ISignUpErrorFormState,
  ISignUpFormState,
} from "../interfaces/commonInterface";
import axios from "axios";
import {
  signInSchema,
  signUpSchema,
  validUserInput,
} from "../utils/zod/validateSchema";
import { convertFieldErrorsToString } from "../utils/helper";
import { useAuthContext } from "../context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../context/ToastContextProvider";
import { useGlobalLoaderContext } from "../context/GlobalLoaderContextProvider";

const AuthPage: React.FC = () => {
  const { user, fetchUser } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.hasOwnProperty("_id")) {
      navigate("/dashboard");
    }
  }, [user]);
  const {showToast} = useToastContext()
  const {setGlobalLoader} = useGlobalLoaderContext()
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState<ISignUpFormState>({
    email: "",
    username: "",
    password: "",
    cnfPassword: "",
  });
  const [signupErrorData, setSignupErrorData] = useState<ISignUpErrorFormState>(
    {
      emailError: "",
      usernameError: "",
      passwordError: "",
      cnfPasswordError: "",
    }
  );
  const [signinData, setSigninData] = useState<ISignInFormState>({
    email: "",
    password: "",
  });
  const [signinErrorData, setSigninErrorData] = useState<ISignInErrorFormState>(
    {
      emailError: "",
      passwordError: "",
    }
  );

  const signUpUser = async () => {
    setGlobalLoader(true)
    try {
      const resp = await axios.post("http://localhost:9000/api/user/register", {
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
      },{withCredentials:true});
      console.log(resp.data);
      setGlobalLoader(false)
      fetchUser!();
    } catch (error) {
      console.log("Unable to register user : ", error);
      setGlobalLoader(false)
      showToast("error",`Unable to register user : ${error}`)
    }
  };
  const handleSignUpFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSignupErrorData(signupErrorData);
    if (signupData.password !== signupData.cnfPassword) {
      setSignupErrorData({
        ...signupErrorData,
        cnfPasswordError: "Password does not match",
      });
    } else {
      const { error, success } = validUserInput(signUpSchema, {
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
      });
      if (typeof error === "object" && !success) {
        // alert("Some error");
        if (typeof error === "object") {
          const fieldErrorObj = convertFieldErrorsToString(error!);
          console.log("ERROR:>>", error, fieldErrorObj);
          if (fieldErrorObj) {
            setSignupErrorData({
              ...signupErrorData,
              emailError: fieldErrorObj.hasOwnProperty("email")
                ? fieldErrorObj.email
                : "",
              usernameError: fieldErrorObj.hasOwnProperty("username")
                ? fieldErrorObj.username
                : "",
              passwordError: fieldErrorObj.hasOwnProperty("password")
                ? fieldErrorObj.password
                : "",
            });
          }
        }
      } else {
        signUpUser();
      }
    }
  };

  const signInUser = async () => {
    setGlobalLoader(true)
    try {
      const resp = await axios.post(
        "http://localhost:9000/api/user/login",
        {
          email: signinData.email,
          password: signinData.password,
        },
        { withCredentials: true }
      );
      console.log(resp.data);
      setGlobalLoader(false)
      fetchUser!();
    } catch (error) {
      console.log("Unable to sign in user : ", error);
      setGlobalLoader(false)
      showToast("error",`Unable to sign in user : ${error}`)
    }
  };
  const handleSignInFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSigninErrorData(signinErrorData);

    const { error, success } = validUserInput(signInSchema, {
      email: signinData.email,
      password: signinData.password,
    });
    if (typeof error === "object" && !success) {
      if (typeof error === "object") {
        const fieldErrorObj = convertFieldErrorsToString(error!);
        console.log("ERROR:>>", error, fieldErrorObj);
        if (fieldErrorObj) {
          setSigninErrorData({
            ...signinErrorData,
            emailError: fieldErrorObj.hasOwnProperty("email")
              ? fieldErrorObj.email
              : "",
            passwordError: fieldErrorObj.hasOwnProperty("password")
              ? fieldErrorObj.password
              : "",
          });
        }
      }
    } else {
      signInUser();
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <form>
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      username: e.target.value,
                    })
                  }
                />
                {signupErrorData.usernameError && (
                  <label
                    htmlFor="email"
                    className="block mb-2 text-md font-medium text-red-500"
                  >
                    {signupErrorData.usernameError}
                  </label>
                )}
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={isLogin ? signinData.email : signupData.email}
                onChange={(e) =>
                  isLogin
                    ? setSigninData({
                        ...signinData,
                        email: e.target.value,
                      })
                    : setSignupData({
                        ...signupData,
                        email: e.target.value,
                      })
                }
              />
              {(signupErrorData.emailError || signinErrorData.emailError) && (
                <label
                  htmlFor="email"
                  className="block mb-2 text-md font-medium text-red-500"
                >
                  {isLogin
                    ? signinErrorData.emailError
                    : signupErrorData.emailError}
                </label>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={isLogin ? signinData.password : signupData.password}
                onChange={(e) =>
                  isLogin
                    ? setSigninData({
                        ...signinData,
                        password: e.target.value,
                      })
                    : setSignupData({
                        ...signupData,
                        password: e.target.value,
                      })
                }
              />
              {(signupErrorData.passwordError ||
                signinErrorData.passwordError) && (
                <label
                  htmlFor="email"
                  className="block mb-2 text-md font-medium text-red-500"
                >
                  {isLogin
                    ? signinErrorData.passwordError
                    : signupErrorData.passwordError}
                </label>
              )}
            </div>
            {!isLogin && (
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="******************"
                  value={signupData.cnfPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      cnfPassword: e.target.value,
                    })
                  }
                />
                {signupErrorData.cnfPasswordError && (
                  <label
                    htmlFor="email"
                    className="block mb-2 text-md font-medium text-red-500"
                  >
                    {signupErrorData.cnfPasswordError}
                  </label>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={
                  isLogin ? handleSignInFormSubmit : handleSignUpFormSubmit
                }
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
              <button
                className="inline-block align-baseline font-bold text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800"
                type="button"
                onClick={toggleAuthMode}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
          </form>
          <hr className="my-6 border-t dark:border-gray-700" />
          <div className="flex flex-col justify-center">
            <GoogleLoginButton
              style={{ backgroundColor: "#333333", color: "#ffffff" }}
              preventActiveStyles={true}
              onClick={() => {}}
            />
            <GithubLoginButton onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
