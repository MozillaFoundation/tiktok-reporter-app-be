###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# add a non-privileged user for running the application
RUN addgroup -g 10001 app && \
    adduser -u 10001 -G app -s /usr/sbin/nologin -D -h /app app -s /bin/sh 

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=app:app package*.json ./
COPY --chown=app:app version*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=app:app . .

# Use the app user from the image (instead of the root user)
USER app

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

# add a non-privileged user for running the application
RUN addgroup -g 10001 app && \
    adduser -u 10001 -G app -s /usr/sbin/nologin -D -h /app app -s /bin/sh 

WORKDIR /app

COPY --chown=app:app package*.json ./
COPY --chown=app:app version*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=app:app --from=development /app/node_modules ./node_modules

COPY --chown=app:app . .

# Run the build command which creates the production bundle
RUN npm run build

# Running `npm ci` removes the existing node_modules directory and passing in --omit=dev ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

USER app

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# add a non-privileged user for running the application
RUN addgroup -g 10001 app && \
    adduser -u 10001 -G app -s /usr/sbin/nologin -D -h /app app -s /bin/sh 

# Copy the bundled code from the build stage to the production image
COPY --chown=app:app --from=build /app/node_modules ./node_modules
COPY --chown=app:app --from=build /app/dist ./dist

ENV PORT=8080
ENV NODE_ENV production

# Start the server using the production build
CMD ["node", "dist/src/main.js" ]
