
// import './App.css'
// import { BrowserRouter as Router, Routes ,Route} from 'react-router-dom'
// import LandingPage from './component/LandingPage'
// import AboutPage from './component/AboutPage'
// import Navbar from './component/NavBar'
// import Footer from './component/Footer'
// import RegisterPage from './component/RegisterPage'
// import LoginPage from './component/LoginPage'
// import { Toaster } from 'react-hot-toast'
// import DashboardLayout from './component/Dashboard/DashboardLayout'
// import ShortenUrlPage from './component/ShortenUrlPage'

// function App() {
  

//   return (
   
//      <Router>
//        <Navbar/>
//        <Toaster position='bottom-center'/>
//         <Routes>
//          <Route path='/' element={<LandingPage/>}/>
//          <Route path='/about' element={<AboutPage/>}/>
//          <Route path='/register' element={<RegisterPage/>}/>
//          <Route path='/login' element={<LoginPage/>}/>
//          <Route path='/dashboard' element={<DashboardLayout/>}/>
//          <Route path="/s/:url" element={<ShortenUrlPage />} />
//        </Routes>
//       <Footer/>
//      </Router>
   
//   )
// }

// export default App

import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { getApps } from './utils/helper'

function App() {

  const CurrentApp = getApps();

  return (
    <Router>
      <CurrentApp />
    </Router>
  )
}

export default App