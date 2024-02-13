from colorama import Fore, Back, Style, init

print(f"{Style.BRIGHT}{Fore.YELLOW}===========================\n\tSERVIDO DNS\n===========================" + Style.RESET_ALL)
ip = input(f"{Fore.BLUE}1. Ingresa la ip del servidor: {Style.RESET_ALL}")

if (ip != "asd"):
    print(f"{Style.BRIGHT}{Back.RED}Formato incorrecto. Por favor ingresa de nueva la dirección ip{Style.RESET_ALL}")