#!/usr/bin/python3

import subprocess
from os import close, path, mkdir
import sys
import re


clone_dir = "./cloned_projects"
commits_urls_file = "./commit_urls.txt"


def read_commit_urls():
    commit_urls = []
    with open(commits_urls_file) as fp:
        for line in fp:
            commit_urls.append(line.rstrip())
    print(f"Found {len(commit_urls)} commit URLs")
    return commit_urls


def prepare_project(project_url: str) -> str:
    project_name = project_url.split("/")[-1]
    project_dir_name = "_".join(project_url.split("/")[-2:])
    project_dir = f"{clone_dir}/{project_dir_name}"

    if not path.exists(clone_dir):
        mkdir(clone_dir)
    if not path.exists(project_dir):
        mkdir(project_dir)
        subprocess.run(f"git clone {project_url}".split(" "), cwd=project_dir)

    return f"{project_dir}/{project_name}"


def compare_commit(commit_url: str):
    parts = commit_url.split("/")
    project_url = "/".join(parts[:-2])
    commit_id = parts[-1]

    repo_dir = prepare_project(project_url)

    # find changed file
    subprocess.run(f"git checkout -f {commit_id}~1".split(" "), cwd=repo_dir)

    changed_files = subprocess.check_output(
        f"git diff-tree --no-commit-id --name-only -r {commit_id}".split(" "), cwd=repo_dir)
    changed_files = changed_files.decode(sys.stdout.encoding)
    changed_files = changed_files.split("\n")
    changed_files = changed_files[:-1] # last line is always empty
    for changed_file in changed_files:
        changed_file = f"{repo_dir}/{changed_file}"

        # find changed line numbers
        git_show = subprocess.check_output(
            f"git show --unified=0 {commit_id}".split(" "), cwd=repo_dir)
        git_show = git_show.decode(sys.stdout.encoding)
        changed_lines = re.findall("@@ -(\d\d*)", git_show)
        changed_lines = [int(s) for s in changed_lines]

        # run JSHint
        # prerequisites:
        #  - install JSHint (e.g., with "npm install -g jshint")
        #  - .jshintrc with '{ "maxerr" : 10000 }'
        warnings = ""
        try:
            subprocess.check_output(
                f"jshint {changed_file}".split(" "))
        except subprocess.CalledProcessError as e:
            # jshint has error exit code to indicate warnings
            warnings = e.output.decode(sys.stdout.encoding) 
        warnings = warnings.split("\n")
        for warning in warnings:
            warning_parts = re.search(": line (\d\d*), col \d\d*, (.*)", warning)
            if warning_parts:
                line_nb = int(warning_parts.group(1))
                msg = warning_parts.group(2)
                close_to_changed_line = False
                for changed_line in changed_lines:
                    if line_nb >= changed_line - 1 and line_nb <= changed_line + 1:
                        close_to_changed_line = True
                if close_to_changed_line:
                    print("----------------------------------")
                    print(f"JSHint warning at line {line_nb}: {msg}")
                    print(f"Code change:\n{git_show}")


if __name__ == "__main__":
    commits_urls = read_commit_urls()
    for commit_url in commits_urls:
        print("\n==================================================")
        print(f"Checking {commit_url} for JSHint warnings")
        compare_commit(commit_url)



