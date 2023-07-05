import { Button, ButtonGroup, LegacyCard, Link, ProgressBar, Text } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useCallback, useEffect, useState } from "react";
import moneyFormat from "../assets/moneyFormat.js";

export default function lineItem({ item, shopifyOrderID, customer }) {
  const [comsposeStatus, setcomsposeStatus] = useState('inactive');

  const [downloadPercent, setDownloadPercent] = useState(0);

  const {
    title,
    properties,
    product_id,
    price,
    quantity
  } = item;

  const {
    data: product,
    isLoading
  } = useAppQuery({ url: `api/products?id=${product_id}` });

  const { order_id, anonim_id } = properties.reduce((props, prop) => ({
    ...props,
    [prop.name]: prop.value
  }), {});

  const downloadProject = useCallback(async () => {
    setcomsposeStatus('composing');

    const name = `${product.title} - ${
      customer.first_name && customer.last_name
        ? `${customer.first_name} ${customer.last_name}(${customer.email})`
        : customer.email
      } - ${order_id.split('-').slice(1).join('-')}.zip`;
    
    const toComposeXHR = new XMLHttpRequest();

    toComposeXHR.open('GET', `${location.origin}/product-builder/orders/compose?order_id=${shopifyOrderID}&project_id=${order_id}`);

    toComposeXHR.onprogress = (event) => {
      const loaded = (event.loaded / 1024 / 1024).toFixed(2);
      const toLoad = (event.total / 1024 / 1024).toFixed(2);

      setDownloadPercent((loaded * 100 / toLoad).toFixed(1));
    };

    toComposeXHR.onloadstart = () => {
      setcomsposeStatus('downloading');
    }

    toComposeXHR.responseType = 'blob';

    toComposeXHR.onloadend = function(e) {
      setcomsposeStatus('load')
      const a = document.createElement('a');

      const downloadURL = URL.createObjectURL(this.response);
  
      a.href = downloadURL;
      a.download = name;
  
      a.click();

      setcomsposeStatus('inactive');
    }

    toComposeXHR.send();
  }, [shopifyOrderID, item, product]);

  if (isLoading) {
    return (
      <></>
    );
  }

  return (
    <LegacyCard.Section>
      <LegacyCard.Subsection>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl + '?width=120&height=120'}
                width={75}
                height={75}
                style={{
                  objectFit: 'cover'
                }}
              ></img>
            )
            }
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <Link
              url={`/products?id=${product.shopify_id}`}
              dataPrimaryLink
              removeUnderline
            >
              { product.title }
            </Link>

            <Text>
              Order id: { order_id.split('-').slice(1).join('-') }
            </Text>
          </div>

          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text>
              { moneyFormat(price * quantity) }
            </Text>
          </div>

          <div style={{
            display: 'flex',
            gap: 10,
            position: 'relative',
            height: '100%'
          }}>
              <Button
                size='slim'
                plain
                url={location.origin + `/product-builder/orders/view?project=${order_id}`}
                target="_blank"
              >
                Preview
              </Button>

              <Button 
                plain
                size='slim'
                onClick={downloadProject}
                
                disabled={comsposeStatus !== 'inactive'}
              >
                Download
              </Button>

            {comsposeStatus !== 'inactive' && (
              <div
                style={{
                  position: "absolute",
                  width: '100%',
                  height: '15px',
                  bottom: 0,
                  transform: 'translateY(150%)',
                }}
              >
                <ProgressBar
                  size="small"
                  progress={parseFloat(downloadPercent)}
                />
              </div>
            )}
          </div>
        </div>
      </LegacyCard.Subsection>
    </LegacyCard.Section>
  )
};