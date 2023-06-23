FROM --platform=linux/arm64 node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

ENV SHOPIFY_API_SECRET=09467d54-41de-4ccd-b7a1-3b468fbf6b9a
ENV SCOPES="write_products, read_customers, write_customers, read_orders, write_orders, read_products"

EXPOSE 8081
WORKDIR /app
COPY web .

RUN npm ci
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
