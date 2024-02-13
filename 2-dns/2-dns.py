from colorama import Fore, Back, Style, init
import os

os.system('clear')
print(f"{Style.BRIGHT}{Fore.YELLOW}===========================\n\tSERVIDO DNS\n===========================" + Style.RESET_ALL)
ip = input("\u0332".join(f"{Style.BRIGHT}1. Ingresa la ip del servidor: "))

if (ip != "asd"):
    print(f"{Fore.BLACK}{Back.RED}Formato incorrecto. Por favor ingresa de nueva la dirección ip{Style.RESET_ALL}")