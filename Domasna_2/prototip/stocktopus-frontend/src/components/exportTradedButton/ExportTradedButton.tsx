import styles from "./exportMostTradedButton.module.css";
import {exportMostTraded} from "../../service/stockDetailsService.ts";

const ExportTradedButton = () => {
    return (
        <button className={styles.exportButton} onClick={exportMostTraded}>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/81a93e587ed429cf259b108714e158e446413fc36bc8019d880dc1a4b0c628d8?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                alt="Export Icon"
                className={styles.exportIcon}
            />
            Export
        </button>
    );
};


export default ExportTradedButton;
