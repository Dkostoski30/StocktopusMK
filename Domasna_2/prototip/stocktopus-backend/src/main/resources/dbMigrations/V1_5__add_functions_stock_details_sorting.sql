CREATE OR REPLACE FUNCTION cast_to_decimal(_value TEXT)
    RETURNS DECIMAL
AS
$$
SELECT CAST(REPLACE(REPLACE(_value, '.', ''), ',', '.') AS DECIMAL)
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_stock_details(
    _stock_name TEXT,
    _date_from TEXT,
    _date_to TEXT,
    _sort_by TEXT,
    _sort_order TEXT
)
RETURNS TABLE (
    stock_name TEXT,
    date DATE,
    max_price TEXT,
    min_price TEXT,
    last_transaction_price TEXT
) AS
$$
SELECT s.stock_name AS stockName,
       sd.date,
       NULLIF(sd.max_price, '') AS maxPrice,
       NULLIF(sd.min_price, '') AS minPrice,
       NULLIF(sd.last_transaction_price, '') AS lastTransactionPrice
FROM stockdetails sd
         JOIN stocks s ON sd.stock_id = s.stock_id
WHERE s.date_deleted IS NULL
  AND (_stock_name IS NULL OR _stock_name = '' OR LOWER(s.stock_name) LIKE LOWER(_stock_name) || '%')
  AND (_date_from IS NULL OR _date_from = '' OR to_char(sd.date, 'YYYY-MM-DD') >= _date_from)
  AND (_date_to IS NULL OR _date_to = '' OR to_char(sd.date, 'YYYY-MM-DD') <= _date_to)
ORDER BY
    CASE
        WHEN _sort_by IS NULL AND _sort_order IS NULL THEN sd.date
        END DESC,
    CASE
        WHEN _sort_by = 'stockName' AND _sort_order = 'asc' THEN s.stock_name
        END NULLS FIRST,
    CASE
        WHEN _sort_by = 'stockName' AND _sort_order = 'desc' THEN s.stock_name
        END DESC NULLS LAST,
    CASE
        WHEN _sort_by = 'maxPrice' AND _sort_order = 'asc' THEN cast_to_decimal(NULLIF(sd.max_price, ''))
        END NULLS FIRST,
    CASE
        WHEN _sort_by = 'maxPrice' AND _sort_order = 'desc' THEN cast_to_decimal(NULLIF(sd.max_price, ''))
        END DESC NULLS LAST,
    CASE
        WHEN _sort_by = 'minPrice' AND _sort_order = 'asc' THEN cast_to_decimal(NULLIF(sd.min_price, ''))
        END NULLS FIRST,
    CASE
        WHEN _sort_by = 'minPrice' AND _sort_order = 'desc' THEN cast_to_decimal(NULLIF(sd.min_price, ''))
        END DESC NULLS LAST,
    CASE
        WHEN _sort_by = 'lastTransactionPrice' AND _sort_order = 'asc' THEN cast_to_decimal(NULLIF(sd.last_transaction_price, ''))
        END NULLS FIRST,
    CASE
        WHEN _sort_by = 'lastTransactionPrice' AND _sort_order = 'desc' THEN cast_to_decimal(NULLIF(sd.last_transaction_price, ''))
        END DESC NULLS LAST,
    CASE
        WHEN _sort_by = 'date' AND _sort_order = 'asc' THEN sd.date
        END NULLS FIRST,
    CASE
        WHEN _sort_by = 'date' AND _sort_order = 'desc' THEN sd.date
        END DESC NULLS LAST
$$ LANGUAGE SQL;
