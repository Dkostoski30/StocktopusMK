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
    details_id BIGINT,
    stock_id BIGINT,
    stock_name TEXT,
    date DATE,
    last_transaction_price TEXT,
    max_price TEXT,
    min_price TEXT,
    average_price TEXT,
    percentage_change TEXT,
    quantity TEXT,
    trade_volume TEXT,
    total_volume TEXT
) AS
$$
SELECT sd.details_id, sd.stock_id, s.stock_name, sd.date, sd.last_transaction_price, sd.max_price,
         sd.min_price, sd.average_price, sd.percentage_change, sd.quantity, sd.trade_volume, sd.total_volume
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
        WHEN _sort_by IS NULL AND _sort_order IS NULL THEN s.stock_name
        END NULLS FIRST,
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
