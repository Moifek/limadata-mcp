FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy source
COPY src/ ./src/

# Install dependencies and build
RUN npm install --production && npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Run the server
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
