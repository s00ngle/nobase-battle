FROM node:23.10.0

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
# npm, pnpm 지정버전 설치
RUN npm install -g npm@11.2.0
RUN npm install -g pnpm@10.6.2
RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
