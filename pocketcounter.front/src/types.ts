// types.ts
export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  costPrice: number;
  dimensions: Dimensions;
  weigth: number;
  quantityForShipping: number;
  reservedQuantity: number;
  actualQuantity: number;
  categoryId: string;
}

export interface ProductsResponse {
  result: {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  errors: string[];
  timeGenerated: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Address {
  zipCode: string;
  country: string;
  state: string;
  city: string;
  streetName: string;
  streetNumber: string;
  apartment: string;
  specialAddressString: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  serialNumber: number;
  address: Address;
  createDateTime: string;
  comment: string;
  status: string;
  totalPrice: number;
  isPaid: boolean;
  cartLines: CartLine[];
  customerId: string;
}

export interface OrdersResponse {
  result: {
    items: Order[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  errors: string[];
  timeGenerated: string;
}

export interface HumanName {
  firstName: string;
  patronymic: string;
  familyName: string;
}

export interface Customer {
  id: string;
  name: HumanName;
  phoneNumber: string;
}

export interface CustomersResponse {
  result: Customer[];
  errors: string[];
  timeGenerated: string;
}