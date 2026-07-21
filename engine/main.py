"""Vercel entrypoint.

Vercel's FastAPI/Python runtime loads the ASGI instance named ``app`` from a
supported entrypoint at the project root. The real application lives in
``luma/api.py``; this module just re-exports it so Vercel can find it.
"""

from luma.api import app  # noqa: F401
