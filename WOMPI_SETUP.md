# Configuración de Wompi para LuxHabitat

## Paso 1: Obtener las credenciales de Wompi

1. Ingresa a [https://comercios.wompi.co/](https://comercios.wompi.co/)
2. Inicia sesión con tu cuenta de Wompi
3. Ve a la sección de "Desarrolladores" o "Credenciales"
4. Copia tus credenciales:
   - Llave pública (Public Key)
   - Llave privada (Private Key)
   - Eventos/Webhook Secret (opcional)

## Paso 2: Configurar el archivo .env

En la carpeta `backend`, copia o edita el archivo `.env` (usa `.env.example` como referencia):

```env
# Wompi Sandbox
WOMPI_PUBLIC_KEY=tu_llave_publica_aqui
WOMPI_PRIVATE_KEY=tu_llave_privada_aqui
WOMPI_WEBHOOK_URL=https://flying-dislocate-skimming.ngrok-free.dev/api/pagos/webhook/
WOMPI_CURRENCY=COP
WOMPI_ENV=sandbox
```

## Paso 3: Ejecutar el backend

1. Asegúrate de activar el entorno virtual:
   ```powershell
   venv\Scripts\activate
   ```
2. Ejecuta las migraciones (si no lo has hecho):
   ```powershell
   python manage.py migrate
   ```
3. Inicia el servidor:
   ```powershell
   python manage.py runserver
   ```

## Paso 4: Configurar ngrok para webhooks (desarrollo local)

1. Instala ngrok (si no lo tienes): https://ngrok.com/download
2. Ejecuta ngrok en el puerto 8000:
   ```powershell
   ngrok http 8000
   ```
3. Copia la URL HTTPS que ngrok te proporciona (ejemplo: `https://abc123.ngrok-free.app`)
4. Actualiza la variable `WOMPI_WEBHOOK_URL` en tu `.env`:
   ```env
   WOMPI_WEBHOOK_URL=https://abc123.ngrok-free.app/api/pagos/webhook/
   ```

## Paso 5: Configurar el webhook en Wompi

1. En el panel de Wompi, ve a la sección de "Webhooks" o "Eventos"
2. Agrega un nuevo webhook con la URL de ngrok (o tu URL de producción)
3. Asegúrate de escuchar los eventos de "transaction.created" y "transaction.updated"

## Paso 6: Ejecutar el frontend

1. En una nueva terminal, navega a la carpeta `frontend`
2. Instala dependencias (si no lo has hecho):
   ```powershell
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```powershell
   npm start
   ```

## Listo!

Ahora puedes probar el flujo de pago seleccionando un plan y haciendo clic en "Pagar con Wompi".
