# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
#FROM registry.access.redhat.com/ubi8/nodejs-14 as build
FROM docker.io/node:14 as build
# Set the working directory
WORKDIR /usr/src/app
COPY ./Frontend/* .
USER root
RUN npm install
RUN npm update
# Generate the build of the application
RUN npm run build --prod

# Stage 2: Serve app with nginx server
FROM registry.access.redhat.com/ubi8/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]
