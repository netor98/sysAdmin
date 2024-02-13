from colorama import Fore, Back, Style, init
import os

class DnsInfo:
    def __init__(self, ip, domain):
        self.ip = ip
        self.domain = domain

    def printProperties(self):
        print(f"Ip: {ip}\nDomain: {domain}")
    
def validateIp(ip):
    return ip != "a"




os.system('clear')
print(f"{Style.BRIGHT}{Fore.YELLOW}===========================\n\tSERVIDO DNS\n===========================" + Style.RESET_ALL)
ip = input(f"{Fore.BLUE}1. Ingresa la ip del servidor: {Style.RESET_ALL}")
while (validateIp(ip)):
    input(f"{Back.RED}La ip no tiene el formato correcto{Style.RESET_ALL}")
    os.system('clear')
    print(f"{Style.BRIGHT}{Fore.YELLOW}===========================\n\tSERVIDO DNS\n===========================" + Style.RESET_ALL)

    ip = input(f"{Fore.BLUE}1. Ingresa la ip del servidor: {Style.RESET_ALL}")


domain = input(f"{Fore.BLUE}2. Ingresa el dominio: {Style.RESET_ALL}")
dns = DnsInfo(ip, domain)
dns.printProperties()

