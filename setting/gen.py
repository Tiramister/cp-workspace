# executed in Cpp/workspace/

import sys
import os
import shutil

if not os.path.exists("./setting/base/"):
    sys.exit("Error: Directory Cpp/workspace/base/ not found")

dirnum = 6  # default number of directories

try:
    dirnum = int(sys.argv[1])
except ValueError:
    sys.exit(
        "Error: Invalid argument for the number of directories (input an integer between 1 and 26)")
except IndexError:
    pass

print("The number of directories: {}".format(dirnum))
if dirnum < 1 or 26 < dirnum:
    sys.exit(
        "Error: Invalid number of directories (input an integer between 1 and 26)")

for i in range(dirnum):
    id = chr(ord('a') + i)

    try:
        shutil.copytree("./setting/base/", "./{}".format(id))
        print("Directory {} is created".format(id))

    except FileExistsError:
        res = input(
            "Directory {} already exists. Overwrite? [y/n]: ".format(id))
        if res == "y":
            shutil.rmtree("./{}".format(id))
            shutil.copytree("./setting/base/", "./{}".format(id))
            print("Directory {} is created".format(id))
        else:
            print("Directory {} is skipped".format(id))
