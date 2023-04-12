import {
  Page,
  Layout,
  LegacyCard
} from "@shopify/polaris";
import { SearchMinor } from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard, CreateProductModal } from "../components";
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