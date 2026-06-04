FROM node:18-alpine

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

# Start backend (which serves frontend dist)
CMD ["npm", "--prefix", "backend", "start"]