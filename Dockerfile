FROM node:12

# Create app directory
WORKDIR /usr/src/booking

# Install app dependencies
COPY package*.json ./

RUN npm install

# if building code for production
# npm ci command helps provide faster, reliable, reproducible builds for production environments
# RUN npm ci --only=production

# Bundle the app source code
COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]