import {
  Modal,
  TextField,
  Spinner
} from "@shopify/polaris";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

import '../assets/style.css';
import { useNavigate } from "react-router-dom";
import ProductSVG from "./ProductSVG";

export function CreateProductModal({
  isOpen,
  handleIsOpen,
  products
}) {
  const navigator = useNavigate();
  const timerRef = useRef();
  const authFetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const getProducts = useCallback((value) => {
    setIsLoading(true);

    authFetch(`api/shopify/products?query=${value}`)
      .then(res => res.json())
      .then(data => {
        setProductsList(data
          .filter(product => products.every(item => item.shopify_id != product.id))
        );
        setIsLoading(false);
      });

  }, [setProductsList, setIsLoading, products]);

  useEffect(() => {
    if (!isOpen) {
      setProductsList([]);
      setSelectedProduct(null);
      setInputValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    if ('' === inputValue) {
      setProductsList([]);
      return;
    }

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      getProducts(inputValue);
    }, 500);
  }, [inputValue, getProducts]);

  const createProduct = useCallback(async () => {
    const data = await authFetch('api/products', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(selectedProduct)
    }).then(res => res.json());

    navigator(`/product?id=${selectedProduct.id}`, { state: data });
  }, [selectedProduct]);

  return (
    <Modal
      open={isOpen}
      onClose={handleIsOpen}
      title="Create customizable product"
      primaryAction={{
        content: 'Add Product',
        onAction: () => {
          createProduct();
        },
        disabled: selectedProduct ? false : true
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleIsOpen
        }
      ]}
    >
      <Modal.Section>
        <div className="related">
          <TextField
            label="Product name"
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            autoComplete="off"
          />

          {selectedProduct && (
            <>
              <div className="related__selected-title">Selected product</div>
              <div className="related__product related__product--is-selected">
                {selectedProduct.image
                  ? (
                    <img
                      src={selectedProduct.image.url + '&height=120'}
                      alt={selectedProduct.handle}
                      width='100px'
                      height='100px'
                    />
                  )
                  : <ProductSVG width={100} height={100} />
                }

                <span>{selectedProduct.title}</span>
              </div>
            </>
          )}

          <div className="related__products-wrapper">
            {!isLoading && productsList.map((product) => (
              <div
                key={product.id}
                className="related__product"
                onClick={() => {
                  setInputValue('');
                  setSelectedProduct(product);
                }}
              >
                {product.image
                  ? (
                    <img
                      src={product.image.url + '&height=60'}
                      alt={product.handle}
                      width='45px'
                      height='45px'
                    />
                  )
                  : <ProductSVG width={45} height={45} />
                }
                <span>{product.title}</span>
              </div>
            ))}

            {isLoading && (
              <div className="related__product is-loading">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </Modal.Section>
    </Modal>
  )
}