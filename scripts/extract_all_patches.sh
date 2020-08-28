#!/bin/bash

# extract all commit hashes
git log --pretty=format:%H > commits.txt

# store each commit in a separate file
mkdir commits
cd commits
for c in `cat ../commits.txt`; do git show $c > $c.txt; done
cd ..

