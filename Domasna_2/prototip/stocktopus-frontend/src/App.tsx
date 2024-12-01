import './App.css';
import { useEffect, useState } from "react";
import { getItems } from "./service/stockService.ts";
import { StockDTO } from "./model/dto/stockDTO.ts";

function App() {
    const [items, setItems] = useState<StockDTO[]>([]);
    const [page, setPage] = useState(0); // Track the current page
    const [size] = useState(10); // Number of items per page
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState<string | null>(null); // Track error state

    useEffect(() => {
        loadItems();
    }, [page, size]); // Trigger when page or size changes

    const loadItems = async () => {
        setLoading(true);
        try {
            const response = await getItems({ page, size });
            setItems(response); // Update state with fetched items
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Error fetching stocks.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    return (
        <div className="App">
            <h1>Stock List</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {items.map(item => (
                    <li key={item.stockId}>
                        {item.stockName}
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={handlePreviousPage} disabled={page === 0}>
                    Previous
                </button>
                <button onClick={handleNextPage}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default App;
