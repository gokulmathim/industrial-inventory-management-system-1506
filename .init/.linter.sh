#!/bin/bash
cd /home/kavia/workspace/code-generation/industrial-inventory-management-system-1506/stock_maintenance_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

