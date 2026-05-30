FROM oven/bun:1.3.12-alpine

WORKDIR /app

RUN npm install --save-dev \
  jest@29.7.0 \
  ts-jest@29.2.5 \
  @types/jest@29.5.12 \
  --no-save

COPY jest.config.js ./
