// Counter.js
import React, {useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

const Counter = () => {
    const count = useSelector((state) => state.count);
    const dispatch = useDispatch();
    const websocketRef = useRef(null);
    websocketRef.current = new WebSocket('ws://localhost:3301');
    useEffect(() => {
     
  
      websocketRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      websocketRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log(response);
        if (response.method !== undefined) {
          const method = response.method;
          if (method === 'increment') {
            dispatch({ type: "INCREMENT" });
          } else if (method === 'decrement') {
            dispatch({ type: "DECREMENT" });
          } else if (method === 'reset') {
            dispatch({ type: "RESET" });
          }
        } else if (response.error) {
          console.error(response.error);
        }
      };
  
      return () => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.close();
        }
      };
    }, []);
  
    const makeRpcRequest = (method) => {
      if (websocketRef.current) {
        const request = {
          jsonrpc: '2.0',
          method,
          id: 1,
        };
  
        websocketRef.current.send(JSON.stringify(request));
      }
    };
  
    const incrementCount = () => {
      makeRpcRequest('increment');
    };
  
    const decrementCount = () => {
      makeRpcRequest('decrement');
    };
  
    const resetCount = () => {
      makeRpcRequest('reset');
    };
    
  return (
    <>
     <div className='h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-gray-700 via-gray-900 to-black'>
      <h1 className='text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 font-bold'>Counter app with redux</h1>
      <p className='font-bold my-14 text-transparent text-9xl bg-clip-text bg-gradient-to-r from-rose-100 to-teal-100'>{count}</p>
       <div className='text-yellow-500 text-xl cursor-pointer'>
           <button className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2' onClick={incrementCount}>Increment</button>
           <button className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900' onClick={resetCount}>Reset</button>
           <button className='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2' onClick={decrementCount}>Decrement</button>
      </div>
    </div>
    </>
  );
};

export default Counter;
