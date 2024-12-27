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
import AuthRouteUsers from "./config/AuthRouteUsers.tsx";
import AuthRouteAdmin from "./config/AuthRouteAdmin.tsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<AuthRouteUsers><Dashboard /></AuthRouteUsers>} />
                <Route path="/admin/*" element={<AuthRouteAdmin><AdminDashboard /></AuthRouteAdmin>} />
                <Route path={"/login"} element={<LoginForm/>}></Route>
                <Route path={"/register"} element={<RegisterForm/>}></Route>
                <Route path={"/admin/stocks"} element={<AuthRouteAdmin><AllStocks/></AuthRouteAdmin>}></Route>
                <Route path="/stock-details/:ticker" element={<AuthRouteAdmin><StockDetailsPage /></AuthRouteAdmin>} />
                <Route path={"/predictor"} element={<AuthRouteUsers><Predictor/></AuthRouteUsers>}></Route>
                <Route path={"/predictor/:stockId"} element={<AuthRouteUsers><PredictorByStockPage/></AuthRouteUsers>}></Route>
                <Route path={"/favorites"} element={<AuthRouteUsers><Favorites/></AuthRouteUsers>}></Route>
            </Routes>
        </div>
    );
}

export default App;