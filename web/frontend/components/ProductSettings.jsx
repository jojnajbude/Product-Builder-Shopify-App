import { Checkbox, Layout, LegacyCard, Box, Divider, Columns, ChoiceList, TextField } from "@shopify/polaris";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";

export function ProductSettings({ saveProduct }) {
  const [hasLayout, setHasLayout] = useState(false);
  const [selectedLayouts, setSelectedLayouts] = useState([]);
  const handleHasLayout = useCallback((newChecked) => setHasLayout(newChecked), []);

  const [hasText, setHasText] = useState(false);
  const handleHasText = useCallback((newChecked) => setHasText(newChecked), []);

  const [hasCrop, setHasCrop] = useState(false);
  const handleHasCrop = useCallback((newChecked) => setHasCrop(newChecked), []);

  const [hasFrame, setHasFrame] = useState(false);
  const handleHasFrame = useCallback((newChecked) => setHasFrame(newChecked), []);

  const [backgroundSetting, setBackgroundSetting] = useState(false);
  const handleHasBackground = useCallback((newChecked) => setBackgroundSetting(newChecked), []);

  const layout = useCallback((image, idx) => (
    <div
      key={idx}
      className={classNames('layouts__item', {
        "is-selected": selectedLayouts.includes(idx)
      })}
      onClick={() => {
        if (!selectedLayouts.includes(idx)) {
          setSelectedLayouts([...selectedLayouts, idx])
        } else {
          setSelectedLayouts(selectedLayouts.filter(item => item !== idx));
        }
      }}
    >
      <div className="layout__item-wrapper">
        {image}
      </div>
    </div>
  ), [selectedLayouts]);

  const layouts = useMemo(() => [
    (
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
    ),
    (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    ),
    (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    ),
    (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    ),
    (
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
    ),
    (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    ),
    (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    ),
    (
      <svg width="44" height="43" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.612396" width="43" height="18" rx="2" fill="currentColor"/>
        <rect x="0.612396" y="25.001" width="43" height="18" rx="2" fill="currentColor"/>
      </svg>
    )
  ], []);


  return (
    <Layout.Section
      
    >
      <LegacyCard
        title="Settings"
        sectioned
        subdued
        primaryFooterAction={{
          content: 'Save',
          onAction: saveProduct
        }}
      >
        <LegacyCard.Section>
          <h2>Product Layout</h2>
          <Checkbox
            onChange={handleHasLayout}
            checked={hasLayout}
            label="Enable Frame edit"
          />

          {hasLayout && (
            <div className="layouts">
              {layouts.map((item, idx) => layout(item, idx))}
            </div>
          )}
        </LegacyCard.Section>

        <LegacyCard.Section>
          <LegacyCard.Subsection>
            <Columns gap="10" columns={2}>
              <Checkbox
                onChange={handleHasFrame}
                checked={hasFrame}
                label="Enable Frame edit"
              />

              <Checkbox
                onChange={handleHasText}
                checked={hasText}
                label="Enable Text edit"
              />
            </Columns>
          </LegacyCard.Subsection>

          <LegacyCard.Subsection>
            <Columns gap="10" columns={2}>
              <Checkbox
                onChange={handleHasCrop}
                checked={hasCrop}
                label="Enable Crop edit"
              />

              <Checkbox
                onChange={handleHasBackground}
                checked={backgroundSetting}
                label="Enable Background edit"
              />
            </Columns>
          </LegacyCard.Subsection>
        </LegacyCard.Section>
      </LegacyCard>
    </Layout.Section>
  )
}