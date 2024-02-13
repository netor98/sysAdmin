# Función para validar la dirección IP
function ValidarIP {
    param([string]$ip)
    $ipRegex = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    if($ip -match $ipRegex) {
        return $true
    } else {
        return $false
    }
}

# Función para validar el nombre de dominio
function ValidarDominio {
    param([string]$dominio)
    $dominioRegex = "^(?=.{1,253}\.?$)[a-zA-Z0-9-]{1,63}(\.[a-zA-Z0-9-]{1,63})*\.com$"
    if ($dominio -match $dominioRegex) {
        return $true
    } else {
        return $false
    }
}

# Instalar el servidor DNS
Install-WindowsFeature -Name 'DNS' -IncludeManagementTools

# Mostrar adaptadores de red
Get-NetAdapter | Select-Object Name, InterfaceIndex, InterfaceDescription

# Solicitar el Interface Index del equipo
$Index = Read-Host -Prompt "Ingrese el InterfaceIndex del equipo"

# Solicitar la dirección IP del equipo
do {
    $ServerIP = Read-Host -Prompt "Ingrese la dirección IP del equipo"
    if (-not (ValidarIP $ServerIP)) {
        Write-Host "ERROR: IP invalida, favor de ingresar una correctamente"
    }
} until (ValidarIP $ServerIP)
Write-Host "IP valida"

# Configurar el servidor DNS
Set-DnsClientServerAddress -InterfaceIndex $Index -ServerAddresses $ServerIP

# Solicitar el dominio deseado para el servidor
do {
    $DomainName = Read-Host -Prompt "Ingrese el nombre del dominio que quiere para el servidor"
    if (-not (ValidarDominio $DomainName)) {
        Write-Host "ERROR: Nombre de dominio invalido, favor de ingresar uno correctamente"
    }
} until (ValidarDominio $DomainName)
Write-Host "Nombre de dominio valido"

# Agregar zona primaria al servidor DNS
Add-DnsServerPrimaryZone -Name $DomainName -ZoneFile "$DomainName.dns" -DynamicUpdate NonSecureAndSecure

# Solicitar la dirección IP de la subred del equipo
do {
    $SubnetIP = Read-Host -Prompt "Ingrese la dirección IP de la subred del equipo"
    if (-not (ValidarIP $SubnetIP)) {
        Write-Host "ERROR: IP invalida, favor de ingresar una correctamente"
    }
} until (ValidarIP $SubnetIP)
Write-Host "IP de la subred valida"

# Solicitar los bits que determinan la Máscara del equipo
$Length = Read-Host -Prompt "Ingrese los Bits de la Máscara"

# Agregar zona inversa al servidor DNS
$ReverseIP = $ServerIP -split '\.' | Select-Object -SkipLast 1 | ForEach-Object {$_}
Add-DnsServerPrimaryZone -NetworkId "$SubnetIP/$Length" -ZoneFile "$ReverseIP.in-addr.arpa.dns"

# Agregar registro de recurso A
Add-DnsServerResourceRecordA -Name $DomainName -ZoneName $DomainName -IPv4Address $ServerIP -CreatePtr

# Probar el servidor DNS
Test-DnsServer -IPAddress $ServerIP -ZoneName $DomainName
