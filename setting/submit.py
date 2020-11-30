# executed in a working directory

import sys
import os
import subprocess

env = os.environ.copy()

# the former is prior
filenames = ["combined.cpp", "main.cpp"]

for filename in filenames:
    if os.path.exists(filename) and os.path.isfile(filename):
        print("Submitted file: {}".format(filename))

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
            sys.exit("Error: Bundle failed.")

        # write to temporary file
        with open("tmp.cpp", mode="w") as f:
            f.write(proc.stdout.decode("utf8"))

        # submit
        try:
            # pass env to use $CPLUS_INCLUDE_PATH
            subprocess.run(["oj", "s", "tmp.cpp", "-y", "-w", "0"],
                           check=True)
        except:
            os.unlink("tmp.cpp")
            sys.exit("Error: Submission failed.")

        # remove the temporary file
        os.unlink("tmp.cpp")
        sys.exit()

sys.exit("Error: No main file found.")
