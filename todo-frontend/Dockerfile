FROM node:10 as build

# make the 'client' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /app/

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'client' folder)
COPY . /app/

# build client for production with minification
RUN npm run build

# => Run container
FROM nginx:1.16.0

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# FROM nginx:1.16.0-alpine

# COPY --from=build-stage /app/build/ /usr/share/nginx/html

# RUN rm /etc/nginx/conf.d/default.conf

# # Copy the default nginx.conf provided by tiangolo/node-frontend
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD [ "http-server", "dist" ]
# CMD ["nginx","-g","deamon off;"]