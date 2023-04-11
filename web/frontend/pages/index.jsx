import {
  Card,
  Page,
  Layout,
  Modal,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Form,
  FormLayout,
  TextField,
  Autocomplete,
  Icon,
  Popover
} from "@shopify/polaris";
import { SearchMinor } from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard, CreateProductModal } from "../components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppQuery } from "../hooks";

export default function HomePage() {
  const [isCreate, setIsCreate] = useState(false);

  const handleIsCreate = useCallback(() => setIsCreate(!isCreate), [isCreate]);

  return (
    <Page>
      <TitleBar title="App name" primaryAction={{ content: "Add product", onAction: handleIsCreate}} />
      <Layout>
        <Layout.Section>
          {isCreate && (<CreateProductModal
            isOpen={isCreate}
            handleIsOpen={handleIsCreate}
          />)}
        </Layout.Section>
        {/* <Layout.Section>
          <ProductsCard/>
        </Layout.Section> */}
      </Layout>
    </Page>
  );
}
