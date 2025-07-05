// filepath: warehouse-management-app/warehouse-management-app/src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  quantity: number;
  locationId: number;
}

export interface Location {
  id: number;
  code: string;
  name: string;
  type: string;
  description?: string;
}

export interface Inbound {
  id: number;
  code: string;
  supplier: string;
  status: string;
  createdAt: string;
}

export interface Outbound {
  id: number;
  code: string;
  customer: string;
  status: string;
  createdAt: string;
}

export interface Stocktaking {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
}

export interface Report {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}