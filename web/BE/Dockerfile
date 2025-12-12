FROM node:20-alpine

WORKDIR /app

# Cài build tools để build native modules (rolldown, esbuild, sharp…)
RUN apk add --no-cache python3 make g++

# Cài dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose port backend
EXPOSE 2082

# Chạy backend (development)
CMD ["yarn", "dev", "--host"]