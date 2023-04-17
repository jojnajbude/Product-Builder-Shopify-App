import { Badge, IndexTable, Text, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthenticatedFetch } from "../hooks";

import ProductSVG from './ProductSVG';

export function ProductList({ products }) {
  const navigator = useNavigate();

  const resourceIDResolver = useCallback((products) => {
    return products.shopify_id;
  }, [products]);

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(products, { resourceIDResolver });

  const rowMarkup = products.map(product => (
    <IndexTable.Row
      id={product.shopify_id}
      key={product.shopify_id}
      onClick={() => {
        navigator(`/product?id=${product.shopify_id}`);
      }}
      selected={selectedResources.includes(product.shopify_id)}
    >
      <IndexTable.Cell>
        <div className="related__product in-table">
          {product.imageUrl
            ? (
              <img
                src={product.imageUrl + '&width=60'}
                alt={product.handle}
                width='30px'
                height='30px'
              />
            )
            : <ProductSVG width={30} height={30}/>
          }
          
          <Text>{product.title}</Text>
        </div>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Badge
          status={product.status === 'active' ? 'success' : 'info'}
        >
          {product.status[0].toUpperCase() + product.status.slice(1)}
        </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Text
        >
          {product.type ? product.type.title : 'None'}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const resourceName = useMemo(() => ({
    singular: 'product',
    plural: 'products'
  }), []);

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={products.length}
      headings={[
        { title: 'Title' },
        { title: 'Status' },
        { title: 'Type' }
      ]}
      selectable={true}
      selectedItemsCount={
        allResourcesSelected ? 'All' : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
    >
      {rowMarkup}
    </IndexTable>
  );
}