import { 
  Layout, 
  LegacyCard,
  EmptyState, 
  AlphaStack, 
  Text, 
  Checkbox
} from "@shopify/polaris";

import { useCallback, useEffect, useMemo, useState } from "react";

export function ProductSettings({
  product,
  typeSettings,
  selectedType,
  settings,
  setSettings
}) {
  // const [selectedLayouts, setSelectedLayouts] = useState(product ? product.settings.selectedLayouts : []);


  // const LayoutCard = useCallback((layout) => (
  //   <div
  //     key={layout.id}
  //     className={classNames('layouts__item', {
  //       "is-selected": selectedLayouts.includes(layout.id)
  //     })}
  //     onClick={() => {
  //       if (!selectedLayouts.includes(layout.id)) {
  //         setSelectedLayouts([...selectedLayouts, layout.id])
  //       } else {
  //         setSelectedLayouts(selectedLayouts.filter(item => item !== layout.id));
  //       }
  //     }}
  //   >
  //     <div className="layout__item-wrapper">
  //       {layout.image}
  //     </div>
  //   </div>
  // ), [selectedLayouts]);

  const layouts = useMemo(() => [
    {
      id: 'layout-1',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.837189" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="0.837189" width="18" height="18" rx="2" fill="currentColor"/>
          <rect x="0.837189" y="25" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="0.837189" y="25" width="18" height="18" rx="2" fill="currentColor"/>
          <rect x="25.8372" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="25.8372" width="18" height="18" rx="2" fill="currentColor"/>
          <rect x="25.8372" y="25" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="25.8372" y="25" width="18" height="18" rx="2" fill="currentColor"/>
      </svg>
    )}
    ,
    {
      id: 'layout-2',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )
    },
    {
      id: 'layout-3',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )
    },
    {
      id: 'layout-4',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )
    },
    {
      id: 'layout-5',
      image: (
        <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.837189" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="0.837189" width="18" height="18" rx="2" fill="currentColor"/>
          <rect x="0.837189" y="25" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="0.837189" y="25" width="18" height="18" rx="2" fill="currentColor"/>
          <rect x="25.8372" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="25.8372" width="18" height="18" rx="2" fill="currentColor"/>
          <rect x="25.8372" y="25" width="18" height="18" rx="2" fill="#FF8714"/>
          <rect x="25.8372" y="25" width="18" height="18" rx="2" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: 'layout-6',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )
    },
    {
      id: 'layout-7',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )
    },
    {
      id: 'layout-8',
      image: (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )}
  ], []);

  if (selectedType === 'none') {
    return (
      <LegacyCard>
        <EmptyState
          heading="Choose product type"
        >
          <p style={{ marginBottom: '20px'}}>To setup your product you must to select product type</p>
        </EmptyState>
      </LegacyCard>
    )
  }

  return (
    <LegacyCard>
      <div style={{ padding: '20px' }}>
        <Text
          as="h2"
          variant="headingLg"
        >
          Settings
        </Text>
      </div>

      {/* {typeSettings.hasLayout && (
        <LegacyCard.Section>
          <div className="layouts">
            <div className="product-settings__heading">
              <Text
                as="h3"
                variant="headingMd"
              >
                Layouts
              </Text>
            </div>

            <div className="layouts__box">
              {layouts.map(layout => LayoutCard(layout))}
            </div>
          </div>
        </LegacyCard.Section>
      )} */}

      {typeSettings.hasText && (
        <LegacyCard.Section>
          <div className="product-settings__heading">
            <Text
              as="h3"
              variant="headingMd"
            >
              Text
            </Text>
          </div>

          <AlphaStack>
            <Checkbox
              label='Enable text'
              checked={settings.hasText}
              onChange={(value) => {
                setSettings({ setting: 'hasText', value })
              }}
            />
          </AlphaStack>
        </LegacyCard.Section>
      )}

      {typeSettings.hasFrame && (
        <LegacyCard.Section>
          <div className="product-settings__heading">
            <Text
              as="h3"
              variant="headingMd"
            >
              Frame
            </Text>
          </div>

          <AlphaStack>
            <Checkbox
              label='Enable frame'
              checked={settings.hasFrame}
              onChange={(value) => {
                setSettings({ setting: 'hasFrame', value })
              }}
            />
          </AlphaStack>
        </LegacyCard.Section>
      )}

      {typeSettings.hasCrop && (
        <LegacyCard.Section>
          <div className="product-settings__heading">
            <Text
              as="h3"
              variant="headingMd"
            >
              Crop
            </Text>
          </div>

          <AlphaStack>
            <Checkbox
              label='Enable crop'
              checked={settings.hasCrop}
              onChange={(value) => {
                setSettings({ setting: 'hasCrop', value })
              }}
            />
          </AlphaStack>
        </LegacyCard.Section>
      )}

      {typeSettings.hasBackground && (
        <LegacyCard.Section>
          <div className="product-settings__heading">
            <Text
              as="h3"
              variant="headingMd"
            >
              Background
            </Text>
          </div>

          <AlphaStack>
            <Checkbox
              label='Enable background'
              checked={settings.hasBackground}
              onChange={(value) => {
                setSettings({ setting: 'hasBackground', value })
              }}
            />
          </AlphaStack>
        </LegacyCard.Section>
      )}

      {typeSettings.hasRotate && (
        <LegacyCard.Section>
          <div className="product-settings__heading">
            <Text
              as="h3"
              variant="headingMd"
            >
              Rotate
            </Text>
          </div>

          <AlphaStack>
            <Checkbox
              label='Enable rotate'
              checked={settings.hasRotate}
              onChange={(value) => {
                setSettings({ setting: 'hasRotate', value })
              }}
            />
          </AlphaStack>
        </LegacyCard.Section>
      )}

      {typeSettings.hasFilter && (
        <LegacyCard.Section>
          <div className="product-settings__heading">
            <Text
              as="h3"
              variant="headingMd"
            >
              Filter
            </Text>
          </div>

          <AlphaStack>
            <Checkbox
              label='Enable filter'
              checked={settings.hasFilter}
              onChange={(value) => {
                setSettings({ setting: 'hasFilter', value })
              }}
            />
          </AlphaStack>
        </LegacyCard.Section>
      )}
    </LegacyCard>
  )
}