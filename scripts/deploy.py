#!/usr/bin/env python3
"""Queue a checked main commit in Coolify through the existing private API."""

import json
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPOSITORY = "asbjborg/games-library"
APPLICATION = "atugukceaowk8e5mboq0qbnm"
API = "http://100.109.151.118:8000/api/v1"


def command(*args: str) -> str:
    return subprocess.run(
        args, cwd=ROOT, check=True, capture_output=True, text=True
    ).stdout.strip()


def main() -> None:
    if command("git", "status", "--porcelain"):
        raise SystemExit("Commit or remove local changes before deploying.")

    local_commit = command("git", "rev-parse", "HEAD")
    remote_commit = command("gh", "api", f"repos/{REPOSITORY}/commits/main", "--jq", ".sha")
    if local_commit != remote_commit:
        raise SystemExit("This checkout must match the published main commit before deployment.")

    runs = json.loads(command(
        "gh", "run", "list", "--repo", REPOSITORY, "--workflow", "check.yml",
        "--branch", "main", "--commit", remote_commit, "--event", "push",
        "--limit", "1", "--json", "status,conclusion",
    ))
    if len(runs) != 1 or runs[0]["status"] != "completed" or runs[0]["conclusion"] != "success":
        raise SystemExit("The Check site workflow must pass for this main commit before deployment.")

    token = command("op", "read", "op://Private/coolify-deploy/credential")
    if not token:
        raise SystemExit("1Password returned an empty deployment token.")

    request = urllib.request.Request(
        f"{API}/deploy?uuid={APPLICATION}",
        method="POST",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        deployment = json.load(response)["deployments"][0]
    print(f"Queued commit: {remote_commit}")
    print(f"Coolify deployment: {deployment['deployment_uuid']}")
    print("Confirm Coolify completion and the public site before declaring the release live.")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        sys.exit(f"Required command failed: {error.cmd[0]}. Check its authentication and access.")
    except urllib.error.HTTPError as error:
        sys.exit(f"Coolify rejected the deployment request (HTTP {error.code}).")
    except urllib.error.URLError as error:
        sys.exit(f"Cannot reach Coolify through Tailscale: {error.reason}")
