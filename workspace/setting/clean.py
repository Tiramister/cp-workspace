import os
import shutil

skipped = ["Makefile", "setting", "ac-library", ".git", ".gitignore", "README.md"]

for path in sorted(os.listdir("./")):
    if path in skipped:
        print("[INFO] {} is skipped.".format(path))
        continue

    if os.path.isfile(path):
        os.unlink(path)
        print("[INFO] {} is removed.".format(path))

    elif os.path.isdir(path):
        shutil.rmtree(path)
        print("[INFO] {} is removed.".format(path))
