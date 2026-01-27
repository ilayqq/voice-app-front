export interface Product {
  id?: number
  name: string
  barcode: string
  description?: string
  category?: string
  createdAt?: string
  updatedAt?: string
  // stocks: []
}

export interface InventoryItem {
  productId: string
  quantity: number
  reserved: number
}

export interface Operation {
  id: string
  type: 'incoming' | 'outgoing'
  productId: string
  quantity: number
  date: string
  notes?: string
  userId?: string
}

export interface ProductWithInventory extends Product {
  quantity: number
  reserved: number
  available: number
}

