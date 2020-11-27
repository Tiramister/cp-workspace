# executed in a working directory

import sys
import os
import subprocess

# the former is prior
filenames = ["combined.cpp", "main.cpp"]

for filename in filenames:
    if os.path.exists(filename) and os.path.isfile(filename):
        print("Submitted file: {}".format(filename))

        # bundle
        try:
            proc = subprocess.run(["oj-bundle", filename],
                                  stdout=subprocess.PIPE)
        except:
            sys.exit("Error: Bundle failed.")

        # write to temporary file
        with open("tmp.cpp", mode="w") as f:
            f.write(proc.stdout.decode("utf8"))

        # submit
        try:
            subprocess.run(["oj", "s", "tmp.cpp", "-y", "-w", "0"])
        except:
            print("Error: Submission failed.")

        # remove the temporary file
        os.unlink("tmp.cpp")
        sys.exit()

sys.exit("Error: No main file found.")
