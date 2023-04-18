import { useAuthenticatedFetch, useContextualSaveBar } from "@shopify/app-bridge-react";
import {
  Button,
  ButtonGroup,
  Columns,
  Frame,
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonPage,
  SkeletonThumbnail,
  Text,
  Thumbnail,
  Toast
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductSettings, RelatedProduct } from "../components";
import ProductSVG from "../components/ProductSVG";
import { useAppQuery } from "../hooks";

export default function Product() { 
  const [searchParams] = useSearchParams();
  const fetch = useAuthenticatedFetch();
  const navigator = useNavigate();

  const {
    show,
    hide,
    saveAction,
    discardAction
  } = useContextualSaveBar();

  const id = useMemo(() => searchParams.get('id'), [searchParams]);

  const [selectedType, setSelectedType] = useState('none');
  const handleSelectChange = useCallback((value) => setSelectedType(value), []);

  const [selectedStatus, setSelectedStatus] = useState('active');
  const handleSelectedStatus = useCallback(value => setSelectedStatus(value), []);

  const [initialState, setInitialState] = useState({});

  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const {
    data: product,
    isLoading: isProductLoading,
    refetch: productRefetch
  } = useAppQuery({url: `api/products?id=${id}`});
  
  const {
    data: types,
    isLoading: isTypeLoading
  } = useAppQuery({ url: `api/types`});

  const changeSettings = (state, action) => {
    if (action.settings) {
      return { ...action.settings };
    }

    const { setting, value } = action;

    const newState = Object.assign({}, state, {
      [setting]: value
    });

    return newState;
  }

  const [typeSettings, setTypeSettings] = useState({});

  const [settings, setSettings] = useReducer(changeSettings, {});

  const [isEdited, setIsEdited] = useState(false);

  const [isLoadingButtons, setIsLoadingButtons] = useState([]);
  
  const saveButtonId = useMemo(() => 'save-button', []);

  const [saveToast, setSaveToast] = useState(false);
  const saveToastMarkup = useMemo(() => saveToast
    ? <Toast
        content="Product saved"
        onDismiss={() => setSaveToast(false)}
        duration={4500}
      />
    : null);

  const deleteProduct = useCallback(async () => {
    setIsLoadingButtons((current) => [...current, product.shopify_id]);

    await fetch(`/api/product/delete?id=${product.shopify_id}`);

    setIsLoadingButtons(current => current.filter(item => item !== product.shopify_id));
    navigator('/');
  }, [product, selectedStatus]);

  const saveProduct = useCallback(async () => {
    setIsLoadingButtons(current => [...current, saveButtonId]);

    const response = await fetch(`api/products/update?id=${product.shopify_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: selectedType,
        status: selectedStatus,
        settings: settings,
        relatedProducts: relatedProducts
      })
    });

    const newProduct = await response.json();

    await productRefetch();

    if (response.ok) {
      setSaveToast(true);
      setInitialState({
        type: newProduct.type.id,
        status: newProduct.status,
        settings: newProduct.settings,
        relatedProducts: newProduct.relatedProducts,
        onStart: true
      });

      setIsLoadingButtons(current => current.filter(button => button !== saveButtonId));
    }

  }, [selectedType, selectedStatus, product, settings, relatedProducts]);

  const discardChanges = useCallback(() => {
    setSelectedStatus(initialState.status);
    setSelectedType(initialState.type);
    setSettings({ settings: initialState.settings });
    setRelatedProducts(initialState.relatedProducts)
  }, [initialState]);

  useEffect(() => {
    saveAction.setOptions({
      onAction: saveProduct,
      loading: isLoadingButtons.includes(saveButtonId),
      disabled: false
    })
  
    discardAction.setOptions({
      onAction: discardChanges
    });
  }, [product, settings, isLoadingButtons, selectedStatus, selectedType]);

  useEffect(() => {
    if (product && types) {
      setSelectedStatus(product.status);

      let settingsToSet;
      let typeToSet;

      if (product.type) {
        const type = types[product.type.id];
        typeToSet = type.id;

        settingsToSet = Object.assign({}, type.settings, product.settings);
        setTypeSettings(type.settings);
      } else if (selectedType !== 'none'){
        const type = types[selectedType];
        typeToSet = type.id;

        settingsToSet = Object.assign({}, type.settings, product.settings);
        setTypeSettings(type.settings);
      } else {
        typeToSet = 'none';
        settingsToSet = { selectedLayouts: [] };
        setTypeSettings({ selectedLayouts: [] });
      }

      if (!initialState.onStart) {
        setInitialState({
          type: typeToSet,
          status: product.status, 
          settings: settingsToSet,
          relatedProducts: product.relatedProducts,
          onStart: true
        });
      }


      setSelectedType(typeToSet);
      setRelatedProducts(product.relatedProducts);
    }
  }, [types, product]);

  useEffect(() => {
    if (product) {
      const productSettingsByType = {};

      for (const setting in typeSettings) {
        if (!typeSettings[setting]) {
          productSettingsByType[setting] = typeSettings[setting];
        } else {
          productSettingsByType[setting] = typeof product.settings[setting] === "boolean"
            ? product.settings[setting]
            : typeSettings[setting];
        }
      }

      setSettings({ settings: Object.assign({}, typeSettings, productSettingsByType) })
    }
  }, [typeSettings, selectedType]);

  useEffect(() => {
    if (product && types) {
      let settingsToSet;

      if (product.type && selectedType === 'none') {
        const type = types[product.type.id];
        settingsToSet = type.settings;
      } else if (selectedType !== 'none'){
        const type = types[selectedType];
        settingsToSet = type.settings;
      } else {
        settingsToSet = { selectedLayouts: [] };
      }

      setTypeSettings(settingsToSet);
    }
  }, [selectedType]);

  useEffect(() => {
    if (product && types) {
      const notEdited = initialState.type === selectedType
        && JSON.stringify(initialState.settings) === JSON.stringify(settings)
        && initialState.status === selectedStatus
        && JSON.stringify(relatedProducts) === JSON.stringify(initialState.relatedProducts);

      if (notEdited) {
        setIsEdited(false);
      } else if (selectedType === 'none' && !notEdited) {
        setIsEdited(false);
      } else {
        setIsEdited(true);
      }
    }
  }, [selectedStatus, selectedType, settings, initialState, relatedProducts]);

  useEffect(() => {
    if (isEdited) {
      show();
    } else {
      hide();
    }
  }, [isEdited]);

  // Return states

  if (isProductLoading || isTypeLoading) {
    return (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <LegacyCard.Header>
                <SkeletonBodyText lines={1} />
              </LegacyCard.Header>

              <LegacyCard.Section>
                <LegacyCard.Subsection>
                  <SkeletonBodyText lines={5} />
                </LegacyCard.Subsection>
                
                <LegacyCard.Subsection>
                  <SkeletonBodyText lines={2} />
                </LegacyCard.Subsection>
              </LegacyCard.Section>

              <LegacyCard.Section>
                <LegacyCard.Subsection>
                  <SkeletonBodyText lines={7} />
                </LegacyCard.Subsection>
                
                <LegacyCard.Subsection>
                  <SkeletonBodyText lines={1} />
                </LegacyCard.Subsection>
              </LegacyCard.Section>

              <LegacyCard.Section>
                <SkeletonThumbnail size="small" />

                <LegacyCard.Subsection>
                  <SkeletonBodyText lines={5} />
                </LegacyCard.Subsection>
                
                <LegacyCard.Subsection>
                  <SkeletonBodyText lines={2} />
                </LegacyCard.Subsection>
              </LegacyCard.Section>

            </LegacyCard>
          </Layout.Section>

          <Layout.Section secondary>
            <LegacyCard vertical>
              <LegacyCard.Header>
              <SkeletonBodyText lines={1} />
              </LegacyCard.Header>

              <LegacyCard.Section>
                <div className="related__product related__product--is-selected">
                  <SkeletonThumbnail size="large" />

                  <SkeletonBodyText lines={1} />
                </div>
              </LegacyCard.Section >

              <LegacyCard.Section>
                <Columns columns={2}>
                  <SkeletonBodyText lines={1} />
                </Columns>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage> 
    )
  }

  return (
    <Frame>
      <Page
        title="Product"
        backAction={{
          content: 'All products',
          url: '/',
        }}
      >
        <Layout>
          <Layout.Section>
            <ProductSettings
              product={product || null}
              typeSettings={typeSettings}
              selectedType={selectedType}
              setSettings={setSettings}
              settings={settings}
            />

            

            <RelatedProduct
              relatedProducts={relatedProducts}
              setRelatedProducts={setRelatedProducts}
            />
          </Layout.Section>

          <Layout.Section
            secondary
          >
            <LegacyCard vertical>

              <LegacyCard.Section>
                <Text
                  alignment="start"
                  as="h2"
                  variant="headingMd"
                >
                  Product info
                </Text>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  margin: '10px 0'
                }}>
                  {!isProductLoading && (product && product.imageUrl
                    ? (
                      <Thumbnail
                        source={product.imageUrl}
                        alt={product.handle}
                        size='large'
                      />
                    )
                    : <ProductSVG width={100} height={100}/>)
                  }

                  <Text
                    as='span'
                    variant='bodyLg'
                    fontWeight='semibold'
                  >
                    {product.title}
                  </Text>
                </div>
              </LegacyCard.Section>

            </LegacyCard>
            
            <LegacyCard>
              <LegacyCard.Section>
                <div style={{ marginBottom: 10 }}>
                  <Text
                    alignment="start"
                    as="h2"
                    variant="headingMd"
                  >
                    Type
                  </Text>
                </div>

                <Select
                  options={types
                    ? [
                      {
                        label: 'None',
                        value: 'none'
                      },
                      ...Object.keys(types).map(type => ({ label: types[type].title, value: types[type].id }))
                    ]
                    : []
                  }
                  value={selectedType}
                  onChange={handleSelectChange}
                  name='Type'
                />
              </LegacyCard.Section>
            </LegacyCard>

            <LegacyCard>
              <LegacyCard.Section>
                <div style={{ marginBottom: 10 }}>
                  <Text
                    alignment="start"
                    as="h2"
                    variant="headingMd"
                  >
                    Status
                  </Text>
                </div>

                <Select
                  options={[
                    {
                      label: 'Active',
                      value: 'active'
                    },
                    {
                      label: 'Draft',
                      value: 'draft'
                    }                  
                  ]}
                  value={selectedStatus}
                  onChange={handleSelectedStatus}
                  name='Status'
                />
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>

        </Layout>

        <div style={{ padding: '20px 0'}}>
          <LegacyStack
            spacing="baseTight"
            distribution="trailing"
          >
            <ButtonGroup>
              <Button
                destructive
                outline
                onClick={deleteProduct}
              >
                Delete product
              </Button>

              <Button 
                onClick={saveProduct}
                id={saveButtonId}
                loading={isLoadingButtons.includes(saveButtonId)}
                disabled={!isEdited}
                primary
              >
                Save
              </Button>
            </ButtonGroup>
          </LegacyStack>
        </div>

        {saveToastMarkup}
      </Page>
    </Frame>
  );
}