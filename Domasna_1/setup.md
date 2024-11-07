# Running the Scripts

This guide provides instructions for running the scripts based on your setup, whether you’re using Docker or running the scripts directly from an IDE (like PyCharm).

## Using Docker

1. **Modify the Database Hostname**  
   In the scripts, replace any instances of `localhost` with `db`. This change is necessary because, in Docker, services communicate using the service names defined in `docker-compose.yml`, and `db` is typically the name used for the database service.

2. **Start Docker Services**  
   Run the following command to build and start the Docker containers:
   ```bash
   docker-compose up --build

## Using IDE (like Pycharm)

1. **Leave the Database Hostname**  
   In the scripts the host name is `localhost`, as the database will be accessible from your local machine’s localhost.

2. **Start Docker Services**  
   Run the following command to build and start the Docker containers or you can run the container if you already have it in Docker:
   ```bash
   docker-compose up --build
   
3. **Run the scripts**\
   In your IDE, connect the database with the correct username and password and then run the `pipe.py`.
