# Usamos Node para el desarrollo
FROM node:18-slim

WORKDIR /app

# Copiamos solo los archivos de paquetes para aprovechar la caché de capas de Docker
COPY package*.json ./
RUN npm install

# Copiamos el código
COPY . .

# Exponemos el puerto de React
EXPOSE 3000

# Comando para iniciar React
CMD ["npm", "start"]
