#!/usr/bin/python3

import argparse
import os, sys

#parser = argparse.ArgumentParser()
#parser.add_argument('--commit_dir', help='Directory with commit files', required=True)
#args = parser.parse_args()

interesting_commits = set()

for file in os.listdir("commits"):
    if file.endswith(".txt"):
        commit = file[:-4]
        with open(os.path.join("commits", file), errors="ignore") as fp:
            try:
                lines = fp.readlines()
            except Exception as exc:
                print("-- Ignoring file due to reading errors {}".format(file))
                print(exc, file=sys.stderr)
                continue

        total_added = 0
        total_removed = 0
        count = True

        for line_idx, line in enumerate(lines):
            if line.startswith("diff --") and (line.endswith(".js") or line.endswith(".js\n") or line.endswith(".js\r\n")):
                count = True
            elif line.startswith("diff --"):
                count = False
            if not count:
                continue

            if line.startswith("+") and (not line.startswith("+++")):
                total_added += 1
            elif line.startswith("-") and (not line.startswith("---")):
                total_removed += 1
                
        total = total_added + total_removed
        if total > 0 and total < 5:
            interesting_commits.add(commit)


for commit in interesting_commits:
    print("{}.txt".format(commit))
                
            

                    

