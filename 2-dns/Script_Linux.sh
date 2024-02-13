#!/bin/bash
# Función para validar el dominio
validar_dominio() {
    read -p "Ingrese el nombre del servicio DNS: " NAMEDNS

    # Expresión regular para validar el dominio
    local patron="^[a-zA-Z0-9.-]+$"

    if echo "$NAMEDNS" | grep -qE "$patron"; then
        return 0
    else
        echo "El dominio ingresado no es válido. Por favor, ingrese solo letras, números y el carácter '.'"
        validar_dominio
    fi
}

echo "Instalando la paqueteria de bind9..."
apt update
apt install bind9
apt install bind9-utils

NAMEDNS=""
validar_dominio

#sudo mkdir /etc/bind/zonas

cat <<EOF >> /etc/bind/named.conf.local
zone "$NAMEDNS" IN {
	type master;
	file "/etc/bind/zonas/db.$NAMEDNS";
};
EOF

cat <<EOF > /etc/bind/zonas/db.$NAMEDNS
;
; BIND data file for local loopback interface
;
\$TTL    604800
@       IN      SOA     servidor.$NAMEDNS. admin.$NAMEDNS. (
                              3         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
       	     	IN      NS      servidor.$NAMEDNS.
servidor	IN	A	192.168.1.8
www    	     	IN      A       192.168.1.8
EOF

sudo named-checkconf
sudo systemctl restart bind9
echo "El servidor DNS ha sido configurado correctamente"
