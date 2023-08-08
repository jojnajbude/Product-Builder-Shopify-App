import { Frame, Layout, LegacyCard, Loading, Page, SkeletonPage, Text} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppQuery } from "../hooks";

import LineItem from '../components/LineItem';
import { authenticatedFetch } from "@shopify/app-bridge-utils";

const DownloadsState = {
  default: 'Download Order',
  composing: 'Waiting to project compose',
  downloading: (loaded, toload) => `Loading: ${loaded}Mb from ${toload}Mb`
}

export default function Order() {
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const fetch = authenticatedFetch();

  const id = useMemo(() => searchParams.get('id'), [searchParams]);

  const [downloadState, setdownloadState] = useState(DownloadsState.default);

  const {
    data: order,
    isLoading,
    refetch
  } = useAppQuery({ url: `api/orders?id=${id}` });

  const { data: shopCurrency, isLoading: currencyIsLoading } = useAppQuery({
    url: 'api/shop'
  });
  
  const composeOrder = useCallback(async () => {
    const toComposeXHR = new XMLHttpRequest();

    toComposeXHR.open('GET', `${location.origin}/product-builder/orders/shopify/order/compose?order=${id}`);

    toComposeXHR.onerror = () => {
      console.log(new Error(toComposeXHR.responseType));
      setdownloadState(DownloadsState.default);
    }

    toComposeXHR.onprogress = (event) => {

      const loaded = (event.loaded / 1024 / 1024).toFixed(2);
      const toLoad = (event.total / 1024 / 1024).toFixed(2);

      setdownloadState(DownloadsState.downloading(loaded, toLoad));
    }

    toComposeXHR.responseType = 'blob';

    toComposeXHR.onloadend = function() {
      const { response } = toComposeXHR;

      const a = document.createElement('a');

      const downloadURL = URL.createObjectURL(response);

      const name = `Order-${order.order_number}(${order.customer.email}).zip`;

      a.href = downloadURL;
      a.download = name;

      a.click();

      setdownloadState(DownloadsState.default);
    };

    toComposeXHR.send();
    setdownloadState(DownloadsState.composing);
  }, [id, order]);

  if (isLoading || currencyIsLoading) {
    return (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            <LegacyCard>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    )
  }

  return (
    <Page
      title={`Order - ${order.name}`}
      backAction={{
        content: 'All orders',
        url: '/orders'
      }}
    >
      <Layout>
        <Layout.Section>
          <LegacyCard title="Products" primaryFooterAction={{
            content: downloadState,
            onAction: composeOrder,
            disabled: downloadState !== 'Download Order'
            // disabled: true,
          }}>  
            {order.line_items
              .filter(item => item.properties.some(prop => prop.name === 'project_id'))
              .map(item => (
                <LineItem
                  key={item.properties.find(prop => prop.name === 'project_id').value}
                  item={item}
                  shopifyOrderID={id}
                  currency={shopCurrency.currency}
                  customer={{
                    first_name: order.customer.first_name,
                    last_name: order.customer.last_name,
                    email: order.customer.email
                  }}
                />)
              )
            }
          </LegacyCard>
        </Layout.Section>

        <Layout.Section secondary>
          <LegacyCard title="Customer">
              {
                order.customer.first_name && order.customer.last_name
                  && (
                    <LegacyCard.Section title="Name">
                      <Text as='p'>{order.customer.first_name} {order.customer.last_name}</Text>
                    </LegacyCard.Section>
                  )
              }

              <LegacyCard.Section title="Contact information">
                <LegacyCard.Subsection>
                  {
                    order.customer.email
                      ? <Text as="p">{order.customer.email}</Text>
                      : <Text as="p">No email address</Text>
                  }
                </LegacyCard.Subsection>

                <LegacyCard.Subsection>
                  {
                    order.customer.phoneNumber
                      ? <Text as="p">{order.customer.phoneNumber}</Text>
                      : <Text as="p" color='subdued'>No phone number</Text>
                  }
                </LegacyCard.Subsection>
              </LegacyCard.Section>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  )
}