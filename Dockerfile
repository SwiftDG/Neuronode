FROM node:22-alpine

WORKDIR /app

# Copy all files
COPY package*.json ./
COPY backend ./backend
COPY frontend ./frontend

# Install and build
RUN npm --prefix backend install && \
    npm --prefix frontend install && \
    npm --prefix frontend run build

# Expose port
EXPOSE 5000

# Start backend
CMD ["npm", "--prefix", "backend", "start"]