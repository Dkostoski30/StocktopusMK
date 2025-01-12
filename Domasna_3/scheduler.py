import datetime
import sys
import time
import importlib.util
import os

def dynamic_import(module_name, module_path):
    spec = importlib.util.spec_from_file_location(module_name, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

parent_directory = os.path.abspath("../")
sys.path.append(parent_directory)

pipe_path = os.path.abspath("../Domasna_1/Web Scrapper demo/pipe.py")

print(f"Path to pipe.py: {pipe_path}")

if not os.path.exists(pipe_path):
    print("Error: pipe.py not found at the specified path.")
    sys.exit(1)

pipe_directory = os.path.dirname(pipe_path)
sys.path.append(pipe_directory)

filter_one_path = os.path.join(pipe_directory, "filter_one.py")
filter_two_path = os.path.join(pipe_directory, "filter_two.py")
filter_three_path = os.path.join(pipe_directory, "filter_three.py")

filter_one = dynamic_import("filter_one", filter_one_path)
filter_two = dynamic_import("filter_two", filter_two_path)
filter_three = dynamic_import("filter_three", filter_three_path)

pipe = dynamic_import("pipe", pipe_path)

print("Current working directory:", os.getcwd())

def main():
    while True:
        try:

            now = datetime.datetime.now()

            target_time = now.replace(hour=15, minute=2, second=0, microsecond=0)

            if now > target_time:
                target_time += datetime.timedelta(days=1)

            time_to_wait = (target_time - now).total_seconds()
            print(
                f"Waiting for {time_to_wait // 60:.0f} minutes and {time_to_wait % 60:.0f} seconds to execute the script..."
            )

            time.sleep(time_to_wait)

            print("Executing scheduled_main() from pipe.py...")
            pipe.scheduled_main()

        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(60)

# Run the scheduler
if __name__ == "__main__":
    main()
