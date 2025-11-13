FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias primero (para aprovechar cache)
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Ahora copiamos el resto del código
COPY . .

# Comando por defecto (se puede sobreescribir en CI)
CMD ["npm", "run", "test:unit"]
