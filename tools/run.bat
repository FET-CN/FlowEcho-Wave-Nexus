:: ???????.

@echo off
if /i "%cd:~-5%"=="tools" (cd ..)

uv run mkdocs build
xcopy site scripts\site\wave /E /I /H /C /K /Y

deno run scripts/main.ts
