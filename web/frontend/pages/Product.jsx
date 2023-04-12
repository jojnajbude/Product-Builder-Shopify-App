import { TitleBar, useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { Layout, LegacyCard, Page, SkeletonDisplayText, SkeletonThumbnail } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProductSVG from "../components/ProductSVG";
import { ProductSettings } from "../components/ProductSettings";
import { useAppQuery } from "../hooks";

export default function Product() {
  const [searchParams] = useSearchParams();

  const id = useMemo(() => searchParams.get('id'), [searchParams]);

  const {
    data: product,
    isLoading
  } = useAppQuery({url: `api/products?id=${id}`});

  const fetch = useAuthenticatedFetch();
  const navigator = useNavigate();

  const [isLoadingButtons, setIsLoadingButtons] = useState([]);

  const deleteProduct = useMemo(() => async () => {
    console.log("Temporary product hasn't been deleted");
    setIsLoadingButtons((current) => [...current, product.shopify_id]);

    await fetch(`/api/product/delete?id=${product.shopify_id}`);

    setIsLoadingButtons(current => current.filter(item => item !== product.shopify_id));
    navigator('/');
  }, []);

  if (!product && !isLoading) {
    return (
      <Page>
        <TitleBar
          title="Product Settings"
          
          breadcrumbs={[
            {
              content: 'All products',
              url: '/',
              target: 'APP'
            }
          ]}
        />
        <Layout>
          <Layout.Section>
            <h1>No product provided</h1>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  const saveProduct = useCallback(async () => {
    console.log('should to save');
    navigator('/')
  }, []);

  return (
    <Page
      title="Product Settings"
      primaryAction={{
        content: "Save",
        onAction: saveProduct
      }}
      breadcrumbs={[
        {
          content: 'All products',
          url: '/',
        }
      ]}
    >
      <Layout>
        <ProductSettings
          saveProduct={saveProduct}
        />

        <Layout.Section
          secondary
        >
          <LegacyCard
            title="Product info"
            secondaryFooterActions={[
              {
                content: "Delete product",
                onAction: deleteProduct,
                loading: product ? isLoadingButtons.includes(product.shopify_id) : false
              }
            ]}
            footerActionAlignment='left'
          >
            <div className="related__product related__product--is-selected">
              {isLoading && (
                <SkeletonThumbnail size="large" />
              )}
              {!isLoading && (product && product.imageUrl
                ? (
                  <img
                    src={product.imageUrl + `&height=120`}
                    alt={product.handle}
                    width='100px'
                    height='100px'
                  />
                )
                : <ProductSVG width={100} height={100}/>)
              }

              <span>{isLoading ? <SkeletonDisplayText size="small"/> : product.title}</span>
            </div>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}