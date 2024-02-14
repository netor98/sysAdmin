# Instalación de la característica y herramientas del servidor DNS
Install-WindowsFeature -Name DNS -IncludeManagementTools
Install-WindowsFeature -Name RSAT-DNS-Server

# Configuración inicial del servidor DNS
$dnsServerName = Read-Host "Ingrese el nombre del servidor DNS"
$dnsForwarderIP = Read-Host "Ingrese la dirección IP del servidor DNS reenviador"

# Configuración de la zona de búsqueda directa (Forward Lookup Zone)
$forwardZoneName = Read-Host "Ingrese el nombre de la zona de búsqueda directa (por ejemplo: miempresa.com)"
$ZoneNameFile = "$forwardZoneName.dns"
Add-DnsServerPrimaryZone -Name $forwardZoneName -ZoneFile $ZoneNameFile

# Configuración de reenviadores DNS
Set-DnsServerForwarder -IPAddress $dnsForwarderIP

# Configuración del registro de recurso (resource record) A para el servidor DNS
$dnsServerIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -eq "Ethernet 2"}).IPAddress
Add-DnsServerResourceRecordA -Name "@" -ZoneName $forwardZoneName -IPv4Address $dnsServerIP
Add-DnsServerResourceRecordA -Name "www" -ZoneName $forwardZoneName -IPv4Address $dnsServerIP

# Reiniciar el servicio de servidor DNS para aplicar los cambios
Restart-Service DNS
