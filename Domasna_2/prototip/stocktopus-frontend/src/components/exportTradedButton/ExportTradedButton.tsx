import styles from "./exportMostTradedButton.module.css";
const ExportTradedButton = () => {
    const handleExport = () => {
        fetch("http://localhost:8080/api/stock-details/exportMostTraded", {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download CSV");
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "most_traded_stocks.csv";
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error exporting CSV:", error);
            });
    };

    return (
        <button className={styles.exportButton} onClick={handleExport}>
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
