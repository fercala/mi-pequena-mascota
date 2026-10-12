# Mi Pequeña Mascota

Juego web para niños de 3 a 5 años: elige una mascota, ponle nombre, cuídala y acompáñala mientras crece. Controles grandes para mouse o pantalla táctil y veinte aventuras y mejoras adicionales.

## Jugar e instalar

[Abrir el juego](https://fercala.github.io/mi-pequena-mascota/).

- Android: abrir en Chrome, pulsar **Instalar el juego** o usar el menú **Instalar aplicación / Añadir a la pantalla de inicio**.
- iPhone y iPad: abrir en Safari, **Compartir → Añadir a la pantalla de inicio → Añadir**.
- Abrir una vez con internet y esperar al mensaje **Juego preparado para jugar sin conexión**. Después se pueden usar todos los cuidados y aventuras sin conexión. Las voces dependen de las instaladas en el dispositivo.

El juego tiene iconos PNG, manifiesto de instalación, modo independiente y caché local. Las actualizaciones se ofrecen con un botón y guardan la partida antes de recargar. No se requiere una tienda de aplicaciones.

## Partidas y privacidad

Hasta cuatro jugadores y sus partidas se guardan en el navegador de este dispositivo. No se envían nombres ni progreso a un servidor. Borrar los datos del navegador elimina las partidas. La dirección anterior y esta nueva dirección tienen almacenamientos separados; las partidas no se trasladan automáticamente.

## Publicación

GitHub Pages publica la rama `main`, carpeta `/docs`. No necesita compilación en GitHub. Todos los recursos se cargan con rutas relativas, incluidas las del modo sin conexión.

Para modificar recursos y regenerar la caché: `npm install`, `npm run build`. Después confirmar y publicar los cambios en `main`. El identificador de caché se calcula con el contenido de los archivos. El caché de esta aplicación no borra el de otros juegos en el mismo dominio.

## Comprobaciones

`npm test` comprueba reglas de cuidado y crecimiento, actividades, persistencia, instalación, recursos precargados y navegación sin conexión bajo la ruta de un repositorio. `npm run preview` sirve el juego localmente en la misma estructura de rutas que GitHub Pages. Se mantienen todos los cuidados y actividades de la versión original.
