#!/bin/bash

repos=$( cat repoList.txt | sed -r 's/(.+)\/(.+)/\2/' )
for r in $repos; do
	echo $r
	cd $r
	rm -f interesting_patches.txt
	for c in `cat interesting_commits.txt`; do
		if [ $c == "--" ]; then
			break
		fi
		cat "commits/$c" >> interesting_patches.txt
	done
	cd ..
done
