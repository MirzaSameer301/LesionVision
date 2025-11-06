import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import ResetPassworrd from './pages/ResetPassworrd.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/authSlice.js'
import Home from './pages/Home.jsx'
function App() {
  const {user,isAuthenticated,loading} =useSelector((state)=>state.auth)
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);
  
  if(loading){
    return <div className='bg-background h-screen w-full flex items-center justify-center'>Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Login />} />
      <Route path="/login" element={!user ? <Login /> : <Home />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Home />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassworrd />} />
    </Routes>
  )
}

export default App
