import express from 'express';

const proxyRouter = express.Router();

proxyRouter.get('/', (req, res) => {
  const file = `
    <html>
      <head>
      </head>
      <body>
        <h1>{{ shop.name }}</h1>

        <p>Pishov na obid</p>
        <p>Cart items: <b>{{ cart.item_count }}</b></p>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'application/liquid')

  res.send(file);
})

export default proxyRouter;