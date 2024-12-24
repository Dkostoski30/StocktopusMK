import datetime
import sys
import time
import importlib.util
import os

# Helper function to dynamically load a module
def dynamic_import(module_name, module_path):
    spec = importlib.util.spec_from_file_location(module_name, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Add parent directory to sys.path
parent_directory = os.path.abspath("../")
sys.path.append(parent_directory)

# Path to the pipe.py file
pipe_path = os.path.abspath("../Domasna_1/Web Scrapper demo/pipe.py")

# Check if the pipe.py path is correct
print(f"Path to pipe.py: {pipe_path}")

if not os.path.exists(pipe_path):
    print("Error: pipe.py not found at the specified path.")
    sys.exit(1)

# Dynamically import dependencies of pipe.py
pipe_directory = os.path.dirname(pipe_path)
sys.path.append(pipe_directory)  # Add pipe.py's directory to sys.path

# Dynamically import filter_one, filter_two, and filter_three
filter_one_path = os.path.join(pipe_directory, "filter_one.py")
filter_two_path = os.path.join(pipe_directory, "filter_two.py")
filter_three_path = os.path.join(pipe_directory, "filter_three.py")

filter_one = dynamic_import("filter_one", filter_one_path)
filter_two = dynamic_import("filter_two", filter_two_path)
filter_three = dynamic_import("filter_three", filter_three_path)

# Dynamically import pipe.py
pipe = dynamic_import("pipe", pipe_path)

# Verify the current working directory
print("Current working directory:", os.getcwd())

# Main function to schedule and execute the script
def main():
    while True:
        try:
            # Get the current time
            now = datetime.datetime.now()

            # Set the target execution time (adjust as needed)
            target_time = now.replace(hour=15, minute=2, second=0, microsecond=0)

            # If the target time is in the past, move it to the next day
            if now > target_time:
                target_time += datetime.timedelta(days=1)

            # Calculate the time to wait
            time_to_wait = (target_time - now).total_seconds()
            print(
                f"Waiting for {time_to_wait // 60:.0f} minutes and {time_to_wait % 60:.0f} seconds to execute the script..."
            )

            # Sleep until the target time
            time.sleep(time_to_wait)

            # Execute the scheduled function from pipe.py
            print("Executing scheduled_main() from pipe.py...")
            pipe.scheduled_main()

        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(60)  # Wait 1 minute before retrying in case of an error

# Run the scheduler
if __name__ == "__main__":
    main()
