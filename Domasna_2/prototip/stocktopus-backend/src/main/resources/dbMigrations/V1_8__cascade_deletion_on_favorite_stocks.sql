ALTER TABLE favorite_stocks
    DROP CONSTRAINT IF EXISTS fkmbuojstm14jxr6mtfgdla24wb;
ALTER TABLE favorite_stocks
    ADD CONSTRAINT fk_user_favorites FOREIGN KEY (username) REFERENCES stocktopus_users (username) ON DELETE CASCADE;