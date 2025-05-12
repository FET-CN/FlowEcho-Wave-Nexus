:: coding:utf-8
:: 加入进FET-WN的共建前请运行此文件

@echo off
if /i "%cd:~-5%"=="tools" (cd ..)

:: UV安装
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

:: 环境配置
uv venv
uv sync

:: 安装Deno
powershell -ExecutionPolicy ByPass -c "irm https://deno.land/install.ps1 | iex"

echo 环境配置完毕！按下回车键退出此脚本...
pause>nul