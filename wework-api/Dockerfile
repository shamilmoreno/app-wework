# Usamos una versión ligera de Node.js
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto que usa tu API (ajústalo si no es el 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
