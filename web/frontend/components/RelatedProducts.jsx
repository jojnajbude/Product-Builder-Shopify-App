import {
  Button,
  Checkbox,
  EmptyState,
  Icon,
  Layout,
  LegacyCard,
  Modal,
  Spinner,
  Text,
  TextField
} from "@shopify/polaris";
import { SearchMajor, CancelMajor } from '@shopify/polaris-icons' 
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import ProductSVG from "./ProductSVG";

import '../assets/style.css';

export function RelatedProduct({ relatedProducts, setRelatedProducts }) {
  const fetch = useAuthenticatedFetch();

  const [products, setProducts] = useState([]);
  const [browseProducts, setBrowseProducts] = useState(false);
  const [browseIsLoading, setBrowseIsLoading] = useState(false);

  const [selected, setSelected] = useState([]);

  const timerRef = useRef();

  const [browseInput, setBrowseInput] = useState('');
  const BrowsePrefix = useMemo(() => (
    <Icon
      source={SearchMajor}
      color='subdued'
    />
  ));

  const getProducts = useCallback(async () => {
    if (browseInput === '') {
      return;
    }
    setBrowseIsLoading(true);

    const data = await fetch(`api/shopify/products?noRelated=true&query=${browseInput}`)
      .then(res => res.json());

    setProducts(data);
    setBrowseIsLoading(false);
  }, [browseInput]);

  useEffect(() => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      getProducts(browseInput);
    }, 500);
  }, [browseInput]);

  return (
    <>
      <LegacyCard>
        <LegacyCard.Section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              as="h2"
              variant="headingLg"
            >
              Related products
            </Text>

            <Button
              onClick={() => setBrowseProducts(true)}
            >
              Add products
            </Button>
          </div>
        </LegacyCard.Section>

        <LegacyCard.Section>
          {relatedProducts.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <img
                width={70}
                height={70}
                style={{ marginBottom: '20px' }}
                src="https://cdn.shopify.com/shopifycloud/web/assets/v1/833d5270ee5c71c0.svg"
              />
              <span>
                There are no related products.
              </span>
              <span>Search and browse to add products.</span>
            </div>
          )}

          {relatedProducts.length > 0 && 
            relatedProducts.map((product, idx) => (
              <div
                className="related__product"
                key={product.id}
              >
                <span>{idx + 1}.</span>
                
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
                
                <span
                  className="related__product-remove"
                  onClick={() => {
                    setSelected(curr => curr.filter(item => item !== product.id));
                    setRelatedProducts(curr => 
                      curr.filter(item => selected.includes(item.id) && item.id !== product.id)
                    );
                  }}
                >
                  <Icon
                    source={CancelMajor}
                    color='subdued'
                  />
                </span>
              </div>
            ))
          }
        </LegacyCard.Section>
      </LegacyCard>

      <Modal
        open={browseProducts}
        onClose={() => setBrowseProducts(false)}
        title='Edit related products'
        primaryAction={{
          content: 'Done',
          onAction: () => {
            setBrowseInput('');
            setProducts([]);
            setBrowseProducts(false);
            setRelatedProducts(curr => [
              ...curr,
              ...products.filter(product => 
                selected.includes(product.id)
                  && !relatedProducts.map(item => item.id).includes(product.id))
              ]
            );
          }
        }}
      >
        <Modal.Section>
          <TextField
            label="Product name"
            value={browseInput}
            onChange={(value) => setBrowseInput(value)}
            autoComplete="off"
            prefix={BrowsePrefix}
            
          />

          <div className="related__products-wrapper">
            {!browseIsLoading && products.map((product) => (
              <div
                key={product.id}
                className="related__product"
                onClick={() => {
                  if (!selected.includes(product.id)) {
                    setSelected(curr => [...curr, product.id])
                  } else {
                    setSelected(curr => curr.filter(item => item !== product.id))
                  }
                }}
              >
                <Checkbox
                  checked={selected.includes(product.id)}
                  onChange={() => {
                    if (!selected.includes(product.id)) {
                      setSelected(curr => [...curr, product.id])
                    } else {
                      setSelected(curr => curr.filter(item => item !== product.id))
                    }
                  }}
                />

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

            {browseIsLoading && (
              <div className="related__product is-loading">
                <Spinner />
              </div>
            )}
          </div>
        </Modal.Section>
      </Modal>
    </>
  )
}