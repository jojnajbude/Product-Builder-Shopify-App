import {
  Page,
  Layout,
  LegacyCard,
  SkeletonPage,
  SkeletonThumbnail,
  SkeletonBodyText,
  IndexTable
} from "@shopify/polaris";
import { SearchMinor } from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { CreateProductModal } from "../components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppQuery } from "../hooks";
import { ProductList } from "../components/ProductList";

export default function HomePage() {
  const [isCreate, setIsCreate] = useState(false);

  const {
    data: products,
    isLoading,
    refetch
  } = useAppQuery({ url: 'api/products' });

  const handleIsCreate = useCallback(() => setIsCreate(!isCreate), [isCreate]);

  if (isLoading) {
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
                    title: 'Title',
                    next: '2',
                    three: '3',
                    four: '4'
                  }
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
    title="App name"
    primaryAction={{ content: "Add product", onAction: handleIsCreate}}
    >
      <Layout>
        <Layout.Section>
          {isCreate && (<CreateProductModal
            isOpen={isCreate}
            handleIsOpen={handleIsCreate}
            products={!isLoading ? products : []}
          />)}
        </Layout.Section>

        <Layout.Section>
          <LegacyCard>
            <ProductList
              products={products ? products : []}
              refetch={refetch}
              isLoading={isLoading}
            />
          </LegacyCard>
      </Layout.Section>
      </Layout>
    </Page>
  );
}