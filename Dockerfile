###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node
RUN npm run test

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --omit=dev ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# add a non-privileged user for running the application
RUN addgroup -g 10001 app && \
    adduser -u 10001 -G app -s /usr/sbin/nologin -D -h /app app -s /bin/sh 

# Install go & geoipupdate
RUN wget https://go.dev/dl/go1.22.2.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.2.linux-amd64.tar.gz && \
    /usr/local/go/bin/go install github.com/maxmind/geoipupdate/v6/cmd/geoipupdate@latest

ARG GEO_LOCATION_ACCOUNT_ID
ARG GEO_LOCATION_API_KEY
RUN echo ${GEO_LOCATION_ACCOUNT_ID}
RUN mkdir -p /usr/local/etc && touch /usr/local/etc/GeoIP.conf && \
    echo "AccountID ${GEO_LOCATION_ACCOUNT_ID}" >> /usr/local/etc/GeoIP.conf && \
    echo "LicenseKey ${GEO_LOCATION_API_KEY}" >> /usr/local/etc/GeoIP.conf && \
    echo "EditionIDs GeoIP2-Country" >> /usr/local/etc/GeoIP.conf && \
    $HOME/go/bin/geoipupdate

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

ENV PORT=8080
ENV NODE_ENV production

USER app
ENTRYPOINT ["node"]
# Start the server using the production build
CMD [ "dist/main.js" ]