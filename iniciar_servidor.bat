@echo off
title Servidor Python Banco de Dados
:: Navega ate a pasta do banco de dados
pushd "C:\Users\ti.06\Documents\Banco de Dados"
:: Inicia o servidor na porta 8000
python -m http.server 8000
pause