@echo off
echo Adding firewall rule for Expo (port 8081)...
netsh advfirewall firewall delete rule name="Expo Metro Bundler" >nul 2>&1
netsh advfirewall firewall add rule name="Expo Metro Bundler" dir=in action=allow protocol=TCP localport=8081
echo.
echo Done! Firewall rule added. You can close this window.
pause
