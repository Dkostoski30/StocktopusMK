ALTER TABLE favorite_stocks
ADD CONSTRAINT unique_user_stock_pair UNIQUE (stock_id, username);
