#!/bin/bash

echo "Starting backend..."
source venv/bin/activate
uvicorn app.main:app --reload --app-dir backend &
BACKEND_PID=$!

echo "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Trap CTRL+C to kill both
trap "kill $BACKEND_PID $FRONTEND_PID" INT

wait