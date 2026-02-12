# Stage 1: Build Frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup Backend & Serve
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Install production dependencies only
RUN npm install --only=production
# Add sqlite3 build tools if necessary, or use a pre-built image. 
# Better-sqlite3/sqlite3 might need python/make on alpine. 
# Let's stick to simple sqlite3 and hope binary is available or use debian-slim if alpine fails.
# Trying alpine first with standard tooling.
RUN apk add --no-cache python3 make g++

# Copy backend files
COPY server/ ./server/

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./public/dist

# Create uploads directory
RUN mkdir -p public/uploads

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server/index.cjs"]
