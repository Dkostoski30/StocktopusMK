import './App.css';
import { HistoricData } from "./pages/HistoricData/HistoricData.tsx";
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
import {Users} from "./pages/Users/Users.tsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<AuthRouteUsers><Dashboard /></AuthRouteUsers>} />
                <Route path="/admin/*" element={<AuthRouteAdmin><HistoricData /></AuthRouteAdmin>} />
                <Route path="/user/*" element={<AuthRouteUsers><HistoricData /></AuthRouteUsers>} />
                <Route path={"/login"} element={<LoginForm/>}></Route>
                <Route path={"/register"} element={<RegisterForm/>}></Route>
                <Route path={"/admin/stocks"} element={<AuthRouteAdmin><AllStocks/></AuthRouteAdmin>}></Route>
                <Route path={"/user/stocks"} element={<AuthRouteUsers><AllStocks/></AuthRouteUsers>}></Route>
                <Route path="/stock-details/:ticker" element={<AuthRouteUsers><StockDetailsPage /></AuthRouteUsers>} />
                <Route path={"/predictor"} element={<AuthRouteUsers><Predictor/></AuthRouteUsers>}></Route>
                <Route path={"/predictor/:stockId"} element={<AuthRouteUsers><PredictorByStockPage/></AuthRouteUsers>}></Route>
                <Route path={"/favorites"} element={<AuthRouteUsers><Favorites/></AuthRouteUsers>}></Route>
                <Route path={"/admin/users"} element={<AuthRouteAdmin><Users/></AuthRouteAdmin>}></Route>

            </Routes>
        </div>
    );
}

export default App;