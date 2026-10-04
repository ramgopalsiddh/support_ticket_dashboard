#!/usr/bin/env python3
import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from seed import seed_database

if __name__ == "__main__":
    seed_database()
