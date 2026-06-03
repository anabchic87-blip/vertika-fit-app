VÉRTIKA FIT · FIX FINAL FIREBASE

Proyecto Firebase:
projectId: vertika-fit-app-c361a

Cambios:
- firebase-config.js actualizado con el Firebase nuevo.
- firebase-app.js normalizado a Firebase SDK 10.12.5.
- index.html carga firebase-app.js como module.
- app.js protegido contra errores de elementos inexistentes.
- service-worker.js desactiva caché vieja.
- Añadido log:
  VÉRTIKA Firebase conectado: vertika-fit-app-c361a

Antes de probar:
1. Authentication: Email/Password habilitado.
2. Dominios autorizados: anabchic87-blip.github.io
3. Firestore creado.
4. Subir TODO el contenido a GitHub sustituyendo archivos.
5. Comprobar:
   https://anabchic87-blip.github.io/vertika-fit-app/js/firebase-config.js
6. F12 > Application > Service Workers > Unregister.
7. Ctrl + Shift + R.
