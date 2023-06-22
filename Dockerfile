FROM --platform=linux/arm64 node

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app
COPY web .

RUN npm ci
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
