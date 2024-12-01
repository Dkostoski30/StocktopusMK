import './App.css'
import {useEffect, useState} from "react";
import {getItems} from "./service/stockService.ts";
import {StockDTO} from "./model/dto/stockDTO.ts";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Dashboard} from "./pages/Index/Dashboard.tsx";
import {AdminDashboard} from "./pages/AdminDashboard/AdminDashboard.tsx";
import {LoginForm} from "./pages/Login/LoginForm.tsx";
import {RegisterForm} from "./pages/Register/RegisterForm.tsx";

function App() {
    const [items, setItems] = useState<StockDTO[]>([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const response = await getItems();
        setItems(response);
    };

  return (
      <Router>
          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
          </Routes>
      </Router>
  )
}

export default App
