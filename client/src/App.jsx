import './App.css'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Landing from './components/landing/landing'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from './StateContext'

function App() {

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/Login" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Landing" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
