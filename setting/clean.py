# executed in Cpp/workspace/

import os
import shutil

skipped = ["Makefile", "setting", ".git", ".gitignore", "README.md"]

for path in sorted(os.listdir("./")):
    if path in skipped:
        print("{} is skipped.".format(path))
        continue

    if os.path.isfile(path):
        os.unlink(path)
        print("{} is removed.".format(path))

    elif os.path.isdir(path):
        shutil.rmtree(path)
        print("{} is removed.".format(path))
