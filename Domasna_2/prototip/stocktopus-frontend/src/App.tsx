import './App.css';
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Index/Dashboard";
import { LoginForm } from "./pages/Login/LoginForm";
import { RegisterForm } from "./pages/Register/RegisterForm";
import { AllStocks } from "./pages/Stocks/AllStocks";
import { StockDetailsPage } from "./pages/StockDetails/StockDetailsPage";
import {Predictor} from "./pages/Predictor/PredictorPage.tsx";
import {PredictorByStockPage} from "./pages/PredictorByStock/PredictorByStockPage.tsx";
import {Favorites} from "./pages/Favorites/Favorites.tsx"
import {Users} from "./pages/Users/Users.tsx"

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path={"/login"} element={<LoginForm/>}></Route>
                <Route path={"/register"} element={<RegisterForm/>}></Route>
                <Route path={"/admin/stocks"} element={<AllStocks/>}></Route>
                <Route path="/stock-details/:ticker" element={<StockDetailsPage />} />
                <Route path={"/predictor"} element={<Predictor/>}></Route>
                <Route path={"/predictor/:stockId"} element={<PredictorByStockPage/>}></Route>
                <Route path={"/favorites"} element={<Favorites/>}></Route>
                <Route path={"/admin/users"} element={<Users/>}></Route>
            </Routes>
        </div>
    );
}

export default App;