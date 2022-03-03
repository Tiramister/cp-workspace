import sys
import os
import shutil

if not os.path.exists("./setting/base/"):
    sys.exit("[ERROR] Directory Cpp/workspace/base/ not found.")

try:
    dirnum = int(sys.argv[1])
except ValueError:
    sys.exit(
        "[ERROR] Invalid argument for the number of directories (input an integer between 1 and 26)")
except IndexError:
    sys.exit(
        "[ERROR] No argument for the number of directories (input an integer between 1 and 26)")

print("[INFO] The number of directories: {}".format(dirnum))
if dirnum < 1 or 26 < dirnum:
    sys.exit(
        "[ERROR] Invalid number of directories (input an integer between 1 and 26)")

for i in range(dirnum):
    id = chr(ord('a') + i)

    try:
        shutil.copytree("./setting/base/", "./{}".format(id))
        print("[INFO] Directory {} is created".format(id))

    except FileExistsError:
        res = input(
            "[INFO] Directory {} already exists. Overwrite? [y/n]: ".format(id))
        if res == "y":
            shutil.rmtree("./{}".format(id))
            shutil.copytree("./setting/base/", "./{}".format(id))
            print("[INFO] Directory {} is created".format(id))
        else:
            print("[INFO] Directory {} is skipped".format(id))
