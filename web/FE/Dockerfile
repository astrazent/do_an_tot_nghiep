FROM node:20-alpine

WORKDIR /app

# Cài build tools để build native module
RUN apk add --no-cache python3 make g++ bash git

# Cài dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose port frontend
EXPOSE 5173

# Chạy frontend (Vite dev server)
CMD ["yarn", "dev", "--host"]