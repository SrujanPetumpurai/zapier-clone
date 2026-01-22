'use client'
import './signup.css' 
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function  Signup() {
//userName,password,name
 const router = useRouter();
 const [email,setEmail] = useState<string>('')
 const [password,setPassword] = useState<string>('');
 const [name,setName] = useState<string>('');
   const registerUser = async (e:React.FormEvent) => {
    e.preventDefault();
  try {
    const res = await fetch("http://localhost:4000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Signup success:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("Token saved:", data.token);
      router.push('/dashboard')
    }
  } catch (err) {
     if (err instanceof Error) {
    console.error("Signup failed:", err.message);
  } else {
    console.error("Signup failed:", err);
  }
  }
};
    return(
        <div className='mt-26 flex w-full px-[17%] justify-between'>
{/* Info*/}          <div className='pt-16 w-[50%]'>
                  <h1 className='text-3xl font-semibold pr-32'>
                    AI Automation starts and scales with Zapier
                  </h1>
                  <p className='mt-8 pr-16 '>
                    Orchestrate AI across your teams, tools,
                     and processes. Turn ideas into automated action today, and power tomorrow’s business growth.
                  </p>
                  <ul className='signup mt-8 flex-col '>
                    <li className='mt-4'>Integrate 8,000+ apps and 300+ AI tools without code</li>
                    <li className='mt-4'>Build AI-powered workflows in minutes, not weeks</li>
                    <li className='mt-4'>14-day trial of all premium features and apps</li>
                  </ul>
                     </div> 
{/* loginInputs*/}   <div className="p-[20px] border border-gray-200 w-[430px] flex flex-col items-center">
                        <Link href='' className='text-center text-white font-semibold w-[100%] rounded px-4 py-2  bg-blue-500 flex '>
                        <span className='inline-block px-1 rounded bg-white mr-20'>
                                    
                                  <svg className='h-5 mt-1 mb-1 w-5'
                                      viewBox="-3 0 262 262"
                                      xmlns="http://www.w3.org/2000/svg"
                                      preserveAspectRatio="xMidYMid"
                                      fill="#fefefeff"
                                  >
                                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                      <g id="SVGRepo_iconCarrier">
                                      <path
                                          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                          fill="#4285F4"
                                      />
                                      <path
                                          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                          fill="#34A853"
                                      />
                                      <path
                                          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                          fill="#FBBC05"
                                      />
                                      <path
                                          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                          fill="#EB4335"
                                      />
                                      </g>
                                  </svg>    
                              
                        </span>
                         Sign up with Google
                         </Link>
                        <div className="flex items-center mt-6">
                            <div className="flex-grow border-t border-red-500"></div>
                            <span className="mx-3 text-gray-700 text-sm font-medium">OR</span>
                            <div className="flex-grow border-t border-gray-500"></div>
                        </div>
                         <form onSubmit={registerUser} className='flex  w-[100%] flex-col mt-8'>
                            <div className='w-full'><label className='text-sm font-semibold' htmlFor="email">*Work email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} id='email' className='w-full mt-2  block py-1 border border-gray-400 rounded' type="text" /></div>
                            <div className='flex w-full gap-4 mt-4'>
                              <div className='w-[50%]'> <label className='text-sm font-semibold' htmlFor="Name">*Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className='px-2 py-1 mt-2 border-gray-400  border rounded' id='Name' type="text" /></div>
                            <div className='w-[50%]'><label className='text-sm font-semibold' htmlFor="Password">*Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className='px-2 py-1 mt-2  border border-gray-400 rounded' id='Password' type="password" /></div>
                            </div>
                            
                            <p className='text-sm font-semibold mt-6'>By signing up, you agree to Zapier's
                                 terms of service and privacy policy.</p>
                                 <button type='submit' className='bg-orange-600 rounded mt-6 text-white py-1'>Get started for free</button>
                         </form>
                         <div className='text-sm mt-6'>
                        Already have an account?<Link href='/login' className='text-blue-600  underline'>Log in</Link>
                     </div>
                     </div> 
                     
        </div>
    )
}