FROM node:alpine 
ARG TARGETOS
ARG TARGETARCH
ENV BUILDX_ARCH="${TARGETOS:-linux}-${TARGETARCH:-amd64}"
ENV BUILDX_VERSION="v0.6.3"
RUN echo "I'm building for $TARGETOS/$TARGETARCH"
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package*.json ./
# RUN npm ci
RUN yarn install
# Copy app files
COPY . .
# Expose port
EXPOSE 8080
# Start the app
CMD [ "yarn","start"] 