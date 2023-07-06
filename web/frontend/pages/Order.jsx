import { Layout, LegacyCard, Page, SkeletonPage, Text} from "@shopify/polaris";
import { useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppQuery } from "../hooks";

import LineItem from '../components/LineItem';
import { authenticatedFetch } from "@shopify/app-bridge-utils";

export default function Order() {
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();

  const id = useMemo(() => searchParams.get('id'), [searchParams]);

  const {
    data: order,
    isLoading,
    refetch
  } = useAppQuery({ url: `api/orders?id=${id}` });

  console.log(order);

  if (isLoading) {
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
          <LegacyCard title="Products">  
            {order.line_items
              .filter(item => item.properties.some(prop => prop.name === 'order_id'))
              .map(item => (
                <LineItem
                  key={item.properties.find(prop => prop.name === 'order_id').value}
                  item={item}
                  shopifyOrderID={id}
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