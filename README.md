# Proyecto Elex

## Acerca de

Aplicación web que gestiona los trámites y servicios de un sistema de expedientes judiciales. Esta aplicación tiene como objetivo facilitar la gestión de los expedientes judiciales, permitiendo a los usuarios realizar trámites y servicios de forma más rápida y eficiente. Además de practicar AngularJS y Spring-boot, el proyecto también tiene como objetivo practicar el uso de la autenticación de usuarios y la protección de recursos.

### Consideraciones

- Crear el modelo con las tablas (4 entidades relacionadas entre sí, expediente, actuaciones,
  documentos y tipos de expediente). Al menos debe haber un campo de tipo entero, otro de tipo
  string, otro de tipo moneda, otro de tipo fichero, otro de tipo fecha, y otro de tipo checkbox.
- Incluir página inicial (index) que permita loguearse en la aplicación con usuario y contraseña (tanto para el frontend como para el backend ->
  usuario: soltel, contraseña: admin).
  - Una vez logado, deberá mostrar un menú con las siguientes opciones:
    - CRUD de la entidad expediente (incluyendo las actuaciones vinculadas a un
      expediente, y para cada actuación, los documentos asociados)
    - Los expedientes deben tener un campo desplegable con los tipos de entidad
    - Los documentos deben tener asociado realmente un fichero. Se admite que se
      almacenen en sistema de ficheros y también en base de datos como blob.
    - CRUD de los tipos de expediente.
    - Acceso a buscadores de cada uno de las entidades. Con dos criterios de filtrado para
      cada una.
    - Realizar la capa de la vista usando Angular consumiendo servicios de backend. Se valorará el
      uso de Bootstrap y el uso (moderado) de reglas adicionales CSS.
    - El back debe permitir consumir los servicios web con Swagger. Esto formará parte de la
      entrega.
    - Se deberá utilizar como IDE el SpringToolSuite
    - Gestionar sesiones y acceso de usuarios.
    - La BBDD se llamará elex (minúsculas). El login a la BBDD será con root/root.

### Adicionales

- Se deben manejar peticiones asíncronas y asíncronas, con promesas, observables
  etc.
- Se debe manejar al menos un popup
- En las llamadas síncronas, deberá aparecer un spinner mientras responde la
  aplicación

## Requirements

- Se necesita tener instalado angular la versión 17.0.0
- Se necesita tener instalado node.js (yo tengo la versión 18.18.2)
- Se necesita tener instalado npm (yo tengo la versión 10.2.3)
- Se necesita tener instalado java (yo tengo la versión 17.0.9)
- Se necesita tener instalado maven (yo tengo la versión 3.9.6)
- Se necesita tener instalado mysql (yo tengo la versión 8.0.35)

## Estrutura del proyecto

- Todos los archivos que son imagenes, pdf y scripts sql estan en la carpeta `src/main/resources/`
- Luego en la carpeta `src/main/java/com/soltel/elex` se encuentran los archivos de la aplicación Spring-boot como pueden ser la configuración, los controladores, los servicios, los modelos, etc.
- En la carpeta `elexAngular/src/app` se encuentran los archivos de la aplicación AngularJS como pueden ser los componentes, los servicios, los modelos, etc.

## Commands

- Para instalar las dependencias del proyecto backend, ejecutar el siguiente comando en la raiz del proyecto backend (ej: /tu_ruta/elex)
  ```bash
  mvn clean install
  ```
- Para instalar las dependencias del proyecto frontend, ejecutar el siguiente comando en la raiz del proyecto frontend (ej: /tu_ruta/elex/elexAngular)
  ```bash
    npm install
  ```
- Para iniciar el proyecto frontend, ejecutar el siguiente comando en la raiz del proyecto frontend (ej: /tu_ruta/elex/elexAngular)

  ```bash
    ng serve
  ```

Que se ejecutara en el puerto 4200 -> Local: http://localhost:4200/

- Luego para el backend dale a run en el proyecto de spring boot y se ejecutara en el puerto 8100 que nos llevara al swagger para ver los end-point -> Local: http://localhost:8100/swagger-ui/index.html

Una vez hecho esto ya se podra acceder a la aplicacion web
