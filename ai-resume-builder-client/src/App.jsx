// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import Login from './pages/Login'
// import Layout from './pages/Layout'
// import Dashboard from './pages/Dashboard'
// import ResumeBuilder from './pages/ResumeBuilder'
// import Preview from './pages/Preview'
// import { login } from './app/features/authSlice'
// import { use } from 'react'
// import {Toaster } from 'react-hot-toast'
// import { useDispatch, useSelector } from 'react-redux'
// import { useEffect } from 'react'

// const App = () => {

//   const [loading, setLoading] = React.useState(false)
//   const dispatch = useDispatch()
//   const getUserData = async () => {
//     const token = localStorage.getItem('token')
//    try {
//     if (token) {
//       const {data} = await api.get('api/users/data', {
//         headers: {
//           Authorization: token
//         }
//       })
//       if (data.user) {
//       dispatch(login({token, user: data.user}))
//     } 
//     dispatch(setLoading(false))
//     } else {
//       dispatch(setLoading(false))
//     }
//     } catch (error) {
//       (setLoading(false))
//       console.log(error.message);
//     }
//   } 

//   useEffect(() => {
//     getUserData()
//   }, [])
//   return (
//     <>
//     <Toaster />
//     <Routes>
//       <Route path='/' element={<Home />} />
//       <Route path='app' element={<Layout />}>
//       <Route index element={<Dashboard />}/>
//       <Route path='builder/:resumeId' element={<ResumeBuilder />}/>
//       </Route>

//       <Route path='view/:resumeId' element={<Preview />}/>
//       {/* <Route path='login' element={<Login />}/> */}
//     </Routes>
//     </>
//   )
// }

// export default App

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Contact from './pages/Contact'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import api from './configs/api.js'

const App = () => {
  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(setLoading(false))
      return
    }

    try {
      dispatch(setLoading(true))
      const { data } = await api.get('/api/users/data', {
        headers: {
          Authorization: token
        }
      })

      if (data.user) {
        dispatch(login({ token, user: data.user }))
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<ResumeBuilder />}/>
        </Route>
        <Route path='contact' element={<Contact />}/>
        <Route path='view/:resumeId' element={<Preview />}/>
      </Routes>
    </>
  )
}

export default App
