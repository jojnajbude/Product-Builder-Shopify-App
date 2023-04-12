import { Spinner, IndexTable, Button, ButtonGroup } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import ProductSVG from './ProductSVG';

export function ProductList({ products, refetch, isLoading }) {
  const authFetch = useAuthenticatedFetch();
  const navigator = useNavigate();

  const [isLoadingButtons, setIsLoadingButtons] = useState([]);

  const rowMarkup = products.map(product => (
    <IndexTable.Row
      id={product.shopify_id}
      key={product.shopify_id}
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
          
          <span>{product.title}</span>
        </div>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <ButtonGroup>
          <Button
            onClick={() => {
              navigator(`/product?id=${product.shopify_id}`, { state: product });
            }}
            
          >
            Edit
          </Button>

          <Button
            onClick={async () => {
              setIsLoadingButtons((current) => [...current, product.shopify_id]);

              await authFetch(`/api/product/delete?id=${product.shopify_id}`);

              setIsLoadingButtons(current => current.filter(item => item !== product.shopify_id));
              refetch();
            }}
            loading={isLoadingButtons.includes(product.shopify_id)
            }
            destructive
          >
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (<>
    <IndexTable
      itemCount={products.length}
      headings={[
        {title: 'Title'},
        {title: 'Action'}
      ]}
      selectable={false}
      loading={isLoading}
    >
      {rowMarkup}
    </IndexTable>
  </>);
}