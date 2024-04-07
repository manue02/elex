# Proyecto Elex

## Instalación

1. Bajar de Github
   git clone https://github.com/manue02/elex.git (saltar este paso si ya se tiene el proyecto)
2. Instalar la BBDD
   Está en src/main/resources/static/elex.mysql
3. Ejecutar el proyecto

entrar en la raiz del proyecto backend

y ejecutar el siguiente comando

```bash
mvn clean install

```

luego entrar en la carpeta raiz del frontend

```bash
cd elexAngular
```

y ejecutar el siguiente comando

```bash
npm install
```

una vez instaladas las dependencias ejecutar el siguiente comando para iniciar el proyecto frontend

```bash
ng serve
```

que se ejecutara en el puerto 4200 -> Local: http://localhost:4200/

Luego para el backend dale a run en el proyecto de spring boot

y se ejecutara en el puerto 8100 que nos llevara al swagger para ver los end-point -> Local: http://localhost:8100/swagger-ui/index.html

Una vez hecho esto ya se podra acceder a la aplicacion web

y para acceder se puede hacer con el siguiente usuario tanto para el frontend como para el backend

usuario: soltel

contraseña: admin
