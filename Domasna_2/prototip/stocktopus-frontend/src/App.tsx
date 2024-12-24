import './App.css';
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Index/Dashboard";
import { LoginForm } from "./pages/Login/LoginForm";
import { RegisterForm } from "./pages/Register/RegisterForm";
import { AllStocks } from "./pages/Stocks/AllStocks";
import { StockDetailsPage } from "./pages/StockDetails/StockDetailsPage";
import {Predictor} from "./pages/Predictor/PredictorPage.tsx";

function App() {
    /*const [items, setItems] = useState<StockDetailsDTO[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);

    function handleChangePage(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    }

    useEffect(() => {
        loadItems();
    }, [page, size]);

    const loadItems = async () => {
        const response = await getItems({ page, size });
        setItems(response);
    };

 /!*   const handleEdit = () => {
        // Handle edit logic
    };

    const handleDelete = () => {
        // Handle delete logic
    };*!/*/

    return (
        <div className="App">
            {/*    {items.map((item) => (
                <TableRowStocks
                    key={`${item.id}`}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}
            <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />*/}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path={"/login"} element={<LoginForm/>}></Route>
                <Route path={"/register"} element={<RegisterForm/>}></Route>
                <Route path={"/admin/stocks"} element={<AllStocks/>}></Route>
                <Route path="/stock-details/:ticker" element={<StockDetailsPage />} />
                <Route path={"/predictor"} element={<Predictor/>}></Route>
            </Routes>
        </div>
    );
}

export default App;