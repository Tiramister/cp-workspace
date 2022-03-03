import sys
import os
import subprocess

env = os.environ.copy()

# the former is prior
filenames = ["combined.cpp", "main.cpp"]

for filename in filenames:
    if os.path.exists(filename) and os.path.isfile(filename):
        print("[INFO] Bundled file: {}".format(filename))

        # bundle
        try:
            cmd = ["oj-bundle", filename]
            # append include paths
            for path in env["CPLUS_INCLUDE_PATH"].split(":"):
                cmd.extend(["-I", path])

            proc = subprocess.run(cmd,
                                  stdout=subprocess.PIPE,
                                  check=True)
        except:
            sys.exit("[ERROR] Bundle failed.")

        # write to temporary file
        with open("bundled.cpp", mode="w") as f:
            f.write(proc.stdout.decode("utf8"))

        print("[INFO] bundled.cpp is created.")
        sys.exit()

sys.exit("[ERROR] No main file (combined.cpp or main.cpp) found.")
