FROM node:22-slim

# Install curl for the build script and clean up
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

WORKDIR /home/user/nextjs-app

# Scaffold the Next.js app (no install yet)
RUN npx --yes create-next-app@15.3.4 . --yes

# Install dependencies explicitly (handle peer deps)
RUN npm install --legacy-peer-deps

# Run shadcn setup (should reuse installed node_modules)
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Move everything (including hidden files) to /home/user and clean up
RUN /bin/bash -c 'shopt -s dotglob && mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app'

WORKDIR /home/user
EXPOSE 3000