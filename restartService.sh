#!/bin/bash

# Restart ISC DHCP service
service isc-dhcp-server restart

# Check if the restart was successful
if [ $? -eq 0 ]; then
    echo "ISC DHCP service restarted successfully"
else
    echo "Failed to restart ISC DHCP service"
fi