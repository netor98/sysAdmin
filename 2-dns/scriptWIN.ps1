function ValidarIP{
param([string]$ip)
$ipRegex = “^(([-0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-
9]|[01]?[0-9][0-9]?)$”
if($ip -match $ipRegex) {
return $true
} else {
 return $false
}
}
function ValidarDominio{
param([string]$dominio)
$dominioRegex = “^(?=.{1,253}\.?$)[a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{1,63})*\.com$”
if ($dominio -match $dominioRegex) {
return $true
} else {
return $false
}
}
# Mensaje de autor al inicio del script
Write-Host “--------------------------------------------------------------------“
Write-Host "Script realizado por: Alvarez Rodriguez Angel Adriel"
Write-Host “--------------------------------------------------------------------“
# Instalamos el servidor DNS
Install-WindowsFeature -Name 'DNS' -IncludeManagementTools
# Mostraremos los adaptadores de red
Get-NetAdapter | Select-Object Name, InterfaceIndex, InterfaceDescription
# Solicitamos el Interface Index del equipo
$Index = Read-Host -Prompt "Ingrese el InterfaceIndex del equipo"
# Solicitamos la dirección IP del equipo
do {
$ServerIP= Read-Host -Prompt “Ingrese la dirección IP del equipo”
if (-not (ValidarIP $ServerIP)){
Write-Host “ERROR: IP invalida, favor de ingresar una correctamente”
}
} until (ValidarIP $ServerIP)
Write-Host “IP valida”
Set-DnsClientServerAddress -InterfaceIndex $Index -ServerAddresses $ServerIP
# Solicitamos el dominio deseado para el servidor
do {
$DomainName= Read-Host -Prompt “Ingrese el nombre del dominio que quiere para
el servidor”
if(-not (ValidarDominoo $DomainName)){
Write-Host “ERROR: Nombre de dominio invalido, favor de ingresar una
correctamente”
}
} until (ValidarDominio $DomainName)
Write-Host “Nombre de dominio valido”
Add-DnsServerPrimaryZone -Name $DomainName -ZoneFile "$DomainName.dns" -
DynamicUpdate NonSecureAndSecure
# Solicitamos la dirección IP de la subred del equipo
do {
$SubnetIP = Read-Host -Prompt "Ingrese la dirección IP de la subred del equipo"
If (-not (ValidarIP $SubnetIP)){
Write-Host “ERROR: IP invalida, favor de ingresar una correctamente”
}
} until (ValidarIP $SubnetIP)
Write-Host “IP de la subred valida”
# Solicitamos los bits que determinan la Máscara del equipo
$Length = Read-Host -Prompt "Ingrese los Bits de la Máscara"
# Solicitamos la IP inversa del servidor
$ReverseIP = Read-Host -Prompt "Ingrese la IP inversa de su servidor"
Add-DnsServerPrimaryZone -NetworkId "$SubnetIP/$Length" -ZoneFile "$ReverseIP.inaddr.arpa.dns"
Add-DnsServerResourceRecordA -Name www -ZoneName $DomainName -IPv4Address
$ServerIP -CreatePtr
Test-DnsServer -IPAddress $ServerIP -ZoneName "www.$DomainName"