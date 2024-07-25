import { useState,useEffect } from 'react'
import Config from './config/config';
import './App.css'
import { login,logout } from './store/authSlice';
import {useDispatch} from "react-redux";
import authService from './appwrite/auth';
import Footer from './components/Footer';
import Header from './components/Header';

import { Outlet } from 'react-router-dom';

function App() {
  const [loader,setloader]=useState(true);
  const dispatch=useDispatch();
  useEffect(()=>{
  authService.getCurrentUser().then(d=>dispatch(login(d))).finally((setloader(false)));
  },[])
  return !loader ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
        TODO:  <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
