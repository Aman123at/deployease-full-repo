// src/LandingPage.js

import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuthContext } from '../context/AuthContextProvider';
import { useEffect } from 'react';

const HomePage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col justify-center items-center">
     
        <Header />
      <main className="container mx-auto flex flex-col justify-center items-center text-center mt-16">
        <h2 className="text-4xl font-extrabold mb-4">
          Seamless Frontend Deployment to S3
        </h2>
        <p className="mb-8">
          Deploy your frontend builds to S3 with ease and efficiency.
        </p>
        <a href="#get-started" className="bg-blue-600 dark:bg-blue-400 text-white px-6 py-3 rounded-full hover:bg-blue-700 dark:hover:bg-blue-500">
          Get Started
        </a>
      </main>

      <section id="features" className="container mx-auto my-16">
        <h3 className="text-3xl font-bold mb-8 text-center">Features</h3>
        <div className="flex flex-wrap justify-center">
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">Easy Setup</h4>
              <p>Get up and running in minutes with our simple setup process.</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">Automatic Deployments</h4>
              <p>Automatically deploy your frontend builds to S3.</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">Scalable</h4>
              <p>Scale your deployment process effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="pricing" className="container mx-auto my-16 bg-blue-600 dark:bg-blue-400 text-white p-8 rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold mb-8 text-center">Pricing</h3>
        <div className="flex flex-wrap justify-center">
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white text-blue-600 p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">Free</h4>
              <p className="text-gray-700 mb-4">Basic features for personal projects</p>
              <p className="font-bold text-xl">$0/month</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white text-blue-600 p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">Pro</h4>
              <p className="text-gray-700 mb-4">Advanced features for small teams</p>
              <p className="font-bold text-xl">$29/month</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <div className="bg-white text-blue-600 p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">Enterprise</h4>
              <p className="text-gray-700 mb-4">All features for large organizations</p>
              <p className="font-bold text-xl">Contact us</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section id="contact" className="container mx-auto my-16">
        <h3 className="text-3xl font-bold mb-8 text-center">Contact Us</h3>
        <form className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Your message"></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Send
            </button>
          </div>
        </form>
      </section> */}

      <footer className="bg-gray-800 dark:bg-gray-700 text-white w-full py-4 mt-auto">
        <div className="container mx-auto text-center">
          &copy; 2024 Deploy Ease. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
