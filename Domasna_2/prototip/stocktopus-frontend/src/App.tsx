import './App.css'
import {useEffect, useState} from "react";
import {getItems} from "./service/stockService.ts";
import {StockDTO} from "./model/dto/stockDTO.ts";

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
      <>
          <ul>
              {items.map(item => (
                  <li key={item.stockId}>
                      {item.stockName}
                  </li>
              ))}
          </ul>
      </>
  )
}

export default App
