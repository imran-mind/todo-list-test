FROM tiangolo/node-frontend:10 as build-stage

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'client' folder the current working directory
WORKDIR /client

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /client/

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'client' folder)
COPY . /client/

# build client for production with minification
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /client/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 8080
# CMD [ "http-server", "dist" ]