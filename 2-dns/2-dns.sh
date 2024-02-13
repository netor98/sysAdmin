#!/bin/bash

# Pedir al usuario la dirección IP del servidor DNS y el dominio
read -p "Introduce la dirección IP del servidor DNS: " ip_dns
read -p "Introduce el nombre de dominio: " dominio

# Instalar el servidor DNS BIND9
# apt-get update
# apt-get install -y bind9

# Configurar el archivo de zona
cat <<EOF > /etc/bind/db.$dominio
\$TTL    604800
@    IN    SOA    ns1.$dominio. admin.$dominio. (
                  3     ; Serial
             604800     ; Refresh
              86400     ; Retry
            2419200     ; Expire
             604800 )   ; Negative Cache TTL
;
@    IN    NS    ns1.$dominio.
ns1  IN    A     $ip_dns
EOF

# Configurar el archivo de configuración de BIND9
# cat <<EOF > /etc/bind/named.conf.local
# zone "$dominio" {
#   type master;
#  file "/etc/bind/db.$dominio";
# };

# zone "$dominio" {
#    type master;
#    file "/etc/bind/
# }
# EOF

ip_volteada=$(echo "$ip_dns" | awk -F'.' '{print $3"."$2"."$1}' | tr -d '\n')

echo "la ip es: $ip_volteada.in-addr.arpa"
# Reiniciar el servicio BIND9 para aplicar los cambios
# systemctl restart bind9

echo "El servidor DNS se ha configurado correctamente para el dominio $dominio con la dirección IP $ip_dns."
