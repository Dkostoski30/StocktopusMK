CREATE TABLE IF NOT EXISTS stocktopus_users
(
    username                   VARCHAR(255) NOT NULL PRIMARY KEY,
    password                   VARCHAR(255) NOT NULL,
    email                      VARCHAR(255) NOT NULL,
    is_account_non_expired     BOOLEAN      NOT NULL DEFAULT TRUE,
    is_account_non_locked      BOOLEAN      NOT NULL DEFAULT TRUE,
    is_credentials_non_expired BOOLEAN      NOT NULL DEFAULT TRUE,
    is_enabled                 BOOLEAN      NOT NULL DEFAULT TRUE,
    role                       VARCHAR(255) NOT NULL
);