const { customerID, shop } = window.cartChecker;

const baseURL = 'https://product-builder.dev-test.pro';

const getCart = async () => {
  return fetch(Shopify.routes.root + 'cart.js').then(res => res.json());
}

const getCustomer = () => {
  return new Promise(async res => {
    const customer = customerID;

    if (!customer) {
      const anonim = await cookieStore.get('product-builder-anonim-id');
  
      if (anonim) {
        res(anonim.value);
        return;
      }
    }
  
    res(customer);
  });
}

async function CartCheck() {
  const [cart, userID] = await Promise.all([getCart(), getCustomer()]);

  console.log(cart, userID, shop);

  const projectsInCart = cart.items
    .filter(item => item.properties.order_id);

  const url = baseURL + '/product-builder/orders/cart/check' + `?id=${userID}&shop=${shop}`;

  const projectExists = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      projects: projectsInCart.map(item => item.properties.order_id)
    })
  }).then(res => res.json());

  const items = projectsInCart
    .filter(project => !projectExists[project.properties.order_id])
    .map(project => ({
      'id': project.key,
      'quantity': 0
    }))
    .map(projectToDelete => fetch(Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectToDelete) 
    }).then(res => res.text()));

  const response = await Promise.all(items);

  console.log(response);

  return true;
}

window.cartReady = CartCheck();