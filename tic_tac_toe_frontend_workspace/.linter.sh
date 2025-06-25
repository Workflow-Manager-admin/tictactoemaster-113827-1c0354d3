#!/bin/bash
cd /home/kavia/workspace/code-generation/tictactoemaster-113827-1c0354d3/tic_tac_toe_frontend_workspace/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

