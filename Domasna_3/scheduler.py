import datetime
import sys
import time
import importlib.util
import os
import fetchCompanyNames
import fetchLatestNews
import indicators
print("Current working directory:", os.getcwd())

def main():
    while True:
        try:

            now = datetime.datetime.now()

            target_time = now.replace(hour=13, minute=49, second=0, microsecond=0)

            if now > target_time:
                target_time += datetime.timedelta(days=1)

            time_to_wait = (target_time - now).total_seconds()
            print(
                f"Waiting for {time_to_wait // 60:.0f} minutes and {time_to_wait % 60:.0f} seconds to execute the script..."
            )

            time.sleep(time_to_wait)

            print("Executing scheduled_main() from pipe.py...")
            fetchCompanyNames.main()
            fetchLatestNews.main()
            indicators.main()
        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(60)

if __name__ == "__main__":
    main()
