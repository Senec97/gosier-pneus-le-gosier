# Git Dumper Honeypot

This repository contains a simulated exposed `.git` directory structure.
When an attacker runs git-dumper or similar tools and executes `git checkout`,
the hook scripts beacon back to the configured C2.
