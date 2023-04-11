import { authenticatedFetch } from "@shopify/app-bridge-utils";
import {
  Modal,
  TextContainer,
  Autocomplete,
  Thumbnail,
  TextField,
  Spinner
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import '../assets/style.css';

export function CreateProductModal({
  isOpen,
  handleIsOpen
}) {
  const [products, setProducts] = useState([]);

  const {
    data
  } = useAppQuery({ url: 'api/products' });

  const timerRef = useRef();
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const getProducts = useCallback((value) => {
    setIsLoading(true);

    fetch(`api/shopify/products?query=${value}`)
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
    const data = await fetch('api/products', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(selectedProduct)
    })

  }, [selectedProduct]);

  useEffect(() => {
    if (data) {
      setProducts(data);
    } 
  }, [selectedProduct, isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={handleIsOpen}
      title="Create customizable product"
      primaryAction={{
        content: 'Add Product',
        onAction: () => {
          handleIsOpen();
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
          />
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
                <Thumbnail
                  source={product.image ? product.image.url : 'https://picsum.photos/600'}
                  alt={product.handle}
                  size='large'
                />
                <span>{product.title}</span>
              </div>
            ))}

            {isLoading && (
              <div className="related__product">
                <Spinner />
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="related__product related__product--is-selected">
              <img
                src={selectedProduct.image ? selectedProduct.image.url : 'https:/picsum.photos/600'}
                alt={selectedProduct.handle}
                width='100px'
                height='100px'
              />
              <span>{selectedProduct.title}</span>
            </div>
          )}
        </div>
      </Modal.Section>
    </Modal>
  )
}