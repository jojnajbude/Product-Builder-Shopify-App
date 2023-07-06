import { useAuthenticatedFetch, useContextualSaveBar } from "@shopify/app-bridge-react";
import {
  Button,
  ButtonGroup,
  Checkbox,
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
  TextField,
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

  const [productQuantity, setProductQuantity] = useState('single');
  const handleProductQuantity = useCallback(value => setProductQuantity(value), []);

  const [minimQuantity, setMininQuantity] = useState(0);

  const [hasMaximum, setHasMaximum] = useState(false);
  const [maximumQuantity, setMaximumQuantity] = useState(0);

  const [resolution, setResolution] = useState({
    width: 0,
    height: 0
  });
  const [resolutionError, setResolutionError] = useState(false);
  const resolutionErrorMarkup = useMemo(() => resolutionError
    ? <Toast
        content="Resolution can't be zero"
        error
        onDismiss={() => setResolutionError(false)}
        duration={4500}
      />
    : null);

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

    let quantity = {
      type: 'single'
    };

    if (productQuantity === 'multiply') {
      quantity = {
        type: 'multiply',
        minimum: minimQuantity
      }

      if (hasMaximum && productQuantity === 'multiply') {
        quantity.maximum = maximumQuantity >= minimQuantity ? maximumQuantity : null;
      }
    } else if (productQuantity === 'set-of') {
      quantity = {
        type: 'set-of'
      }
    }

    if (resolution.width <= 0 || resolution.height <= 0) {
      setResolutionError(true);
      discardChanges();
      setIsLoadingButtons([]);
      return;
    }

    const response = await fetch(`api/products/update?id=${product.shopify_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: selectedType,
        status: selectedStatus,
        settings: settings,
        relatedProducts: relatedProducts,
        quantity,
        resolution
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
        quantity: newProduct.quantity,
        resolution: newProduct.resolution,
        onStart: true
      });

      setIsLoadingButtons(current => current.filter(button => button !== saveButtonId));
    }

  }, [selectedType, selectedStatus, product, settings, relatedProducts, productQuantity, minimQuantity, maximumQuantity, resolution]);

  const discardChanges = useCallback(() => {
    setSelectedStatus(initialState.status);
    setSelectedType(initialState.type);
    setSettings({ settings: initialState.settings });
    setRelatedProducts(initialState.relatedProducts);
    setProductQuantity(initialState.quantity.type);

    setResolution(initialState.resolution);

    if (initialState.quantity.type === 'multiply') {
      setMininQuantity(initialState.quantity.minimum);

      if (hasMaximum && initialState.quantity.maximum) {
        setMaximumQuantity(initialState.quantity.maximum)
      }
    }
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
  }, [product, settings, isLoadingButtons, selectedStatus, selectedType, minimQuantity, productQuantity, maximumQuantity, hasMaximum, resolution]);

  useEffect(() => {
    if (product && types) {
      setSelectedStatus(product.status);

      console.log(product);
      setProductQuantity(product.quantity.type);

      if (product.quantity.type === 'multiply') {
        setMininQuantity(product.quantity.minimum);

        if (product.quantity.maximum) {
          setHasMaximum(true);
          setMaximumQuantity(product.quantity.maximum);
        }
      }

      setResolution(product.resolution ? product.resolution : { width: 0, height: 0 });

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
          quantity: product.quantity,
          resolution: product.resolution,
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
        && JSON.stringify(relatedProducts) === JSON.stringify(initialState.relatedProducts)
        && JSON.stringify(productQuantity) === JSON.stringify(initialState.quantity.type)
        && (productQuantity === 'multiply' ? minimQuantity === initialState.quantity.minimum : true)
        && (productQuantity === 'multiply' && hasMaximum ? maximumQuantity === initialState.quantity.maximum : true)
        && JSON.stringify(resolution) === JSON.stringify(initialState.resolution);

      if (notEdited) {
        setIsEdited(false);
      } else if (selectedType === 'none' && !notEdited) {
        setIsEdited(false);
      } else {
        setIsEdited(true);
      }
    }
  }, [selectedStatus, selectedType, settings, initialState, relatedProducts, productQuantity, minimQuantity, maximumQuantity, hasMaximum, resolution]);

  useEffect(() => { 
    if (isEdited) {
      show();
    } else {
      hide();
    } 
  }, [isEdited]);

  useEffect(() => {
    if (hasMaximum && maximumQuantity < minimQuantity) {
      setMaximumQuantity(minimQuantity)
    }
  }, [hasMaximum]);

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

              <LegacyCard.Section>
                <div style={{ marginBottom: 10 }}>
                  <Text
                    alignment="start"
                    as="h2"
                    variant="headingMd"
                  >
                    Quantity type
                  </Text>
                </div>

                <Select
                  options={[
                    {
                      label: 'Multiply',
                      value: 'multiply'
                    },
                    {
                      label: 'Set of',
                      value: 'set-of',
                    },
                    {
                      label: 'Single',
                      value: 'single'
                    }
                  ]}
                  value={productQuantity}
                  onChange={handleProductQuantity}
                  name='Quantity'
                />

                {productQuantity === 'multiply' && (
                  <>
                    <div style={{ marginTop: 20 }}>
                      <TextField
                        label="Minim Quantity"
                        type="number"
                        value={minimQuantity}
                        onChange={value => setMininQuantity(+value)}
                        autoComplete="off"
                        min={0}
                      />
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <Checkbox
                        label='Set maximum quantity'
                        checked={hasMaximum}
                        onChange={value => setHasMaximum(value)}
                      />
                    </div>

                    {hasMaximum && (
                      <div style={{ marginTop: 20 }}>
                        <TextField
                          label="Maximum Quantity"
                          type="number"
                          value={maximumQuantity}
                          onChange={value => setMaximumQuantity(+value)}
                          autoComplete="off"
                          min={minimQuantity}
                        />
                      </div>
                    )}
                  </>
                )}
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
                    Size
                  </Text>
                </div>

                <div style={{ marginTop: 20 }}>
                  <TextField
                    label="Width, cm"
                    type="number"
                    value={resolution.width}
                    onChange={value => setResolution(prev => ({
                      ...prev, 
                      width: parseFloat(value)
                    }))}
                    autoComplete="off"
                    min={0}
                    step={0.1}
                    error={resolution.width === 0 && initialState.resolution && resolution.width !== initialState.resolution.width}
                  />
                </div>

                <div style={{ marginTop: 20 }}>
                  <TextField
                    label="Height, cm"
                    type="number"
                    value={resolution.height}
                    onChange={value => setResolution(prev => ({
                      ...prev,
                      height: parseFloat(value)
                    }))}
                    autoComplete="off"
                    min={0}
                    step={0.1}
                    error={resolution.height === 0 && initialState.resolution && resolution.height !== initialState.resolution.height}
                  />
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
        {resolutionErrorMarkup}
      </Page>
    </Frame>
  );
}