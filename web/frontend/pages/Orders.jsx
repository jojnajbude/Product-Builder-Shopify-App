import { Badge, Button, Icon, IndexTable, Layout, LegacyCard, Page, SkeletonBodyText, SkeletonPage, SkeletonThumbnail, useIndexResourceState } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  UploadMajor
} from '@shopify/polaris-icons';
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import moneyFormat from "../assets/moneyFormat.js";

Number.prototype.formatItems = function() {
  if (this === 0) {
    return 'Empty'
  }

  if (this === 1) {
    return this + ' item';
  }

  return this + ' items';
}

export default function Orders() {
  const navigator = useNavigate();

  const ref = useRef({
    refetchTimer: null
  });

  const { data: shopCurrency, isLoading: currencyIsLoading } = useAppQuery({
    url: 'api/shop'
  });

  const {
    data: orders,
    isLoading,
    refetch
  } = useAppQuery({ url: 'api/orders' });

  const resourceIDResolver = useCallback((order) => {
    return order._id;
  }, [orders]);

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(orders, { resourceIDResolver });

  const rowMarkup = useMemo(() => {
    if (!orders) {
      return;
    }

    return orders.map((order) => (
      <IndexTable.Row
        id={order._id}
        key={order.shopify_id}
        onClick={(event) => {
          navigator(`/order?id=${order.shopify_id}`);
        }}
        selected={selectedResources.includes(order._id)}
      >
        <IndexTable.Cell>
          <div className="related__product in-table">          
            <h3>{order.name}</h3>
          </div>
        </IndexTable.Cell>

        <IndexTable.Cell>
          { order.customer.first_name && order.customer.last_name 
            ? `${order.customer.first_name} ${order.customer.last_name}` 
            : order.customer.email
          }
        </IndexTable.Cell>

        <IndexTable.Cell>
          { order.currency }
          { moneyFormat(parseInt(order.current_subtotal_price), order.currency || 'USD') }
        </IndexTable.Cell>

        <IndexTable.Cell>
          {
            order.line_items.reduce((sum, item) => sum + item.quantity, 0).formatItems()
          }
        </IndexTable.Cell>
      </IndexTable.Row>
    ))
  });

  const resourceName = useMemo(() => ({
    singular: 'order',
    plural: 'orders'
  }), []);

  useEffect(() => {
    console.log(ref.current.refetchTimer);
    ref.current.refetchTimer = setInterval(() => {
      console.log('refetched');
      refetch();
    }, 10000);

    return () => {
      clearInterval(ref.current.refetchTimer);
    }
  }, []);

  if (isLoading || currencyIsLoading) {
    const SkeletonRow = (i) => (
      <IndexTable.Row id={'1'} key={i} position={1}>
        <IndexTable.Cell>
          <SkeletonThumbnail size="extraSmall" />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <SkeletonBodyText lines={1} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <SkeletonBodyText lines={1} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <SkeletonBodyText lines={1} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <SkeletonBodyText lines={1} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <SkeletonBodyText lines={1} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <SkeletonBodyText lines={1} />
        </IndexTable.Cell>
      </IndexTable.Row>
    );

    return (
      <SkeletonPage primaryAction>
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <IndexTable
                itemCount="10"
                headings={[
                  {
                    title: 'Order',
                    next: '2',
                    three: '3',
                    four: '4'
                  },
                  { title: 'Customer' },
                  { title: 'Total' },
                  { title: 'Items' },
                ]}
                selectable
              >
                {Array.from({ length: 10}, (_, i) => SkeletonRow(i))}
              </IndexTable>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    )
  }

  return (
    <Page
      title="Orders List"
    >
      <Layout>
        <Layout.Section>
          <LegacyCard>
            <IndexTable
              resourceName={resourceName}
              itemCount={orders.length}
              headings={[
                {
                  title: 'Order',
                },
                { title: 'Customer' },
                { title: 'Total' },
                { title: 'Items' },
              ]}
              selectable={true}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
      </Layout.Section>
        </Layout>
    </Page>
  )
}