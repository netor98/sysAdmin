from colorama import Fore, Back, Style, init

# Inicializa colorama para sistemas Windows
init()

# Imprime texto en diferentes colores
print(Fore.RED + 'Este texto está en rojo')
print(Fore.GREEN + 'Este texto está en verde')
print(Fore.YELLOW + 'Este texto está en amarillo')
print(Fore.BLUE + 'Este texto está en azul')
print(Fore.MAGENTA + 'Este texto está en magenta')
print(Fore.CYAN + 'Este texto está en cian')
print(Style.RESET_ALL)  # Restablece el color a su valor predeterminado

# También puedes cambiar el color de fondo
print(Back.RED + 'Este texto tiene fondo rojo')
print(Style.RESET_ALL)  # Restablece el color a su valor predeterminado
