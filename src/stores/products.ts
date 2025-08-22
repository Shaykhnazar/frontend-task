import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: "in_stock" | "out_of_stock" | "discontinued";
  createdAt?: string;
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([
    { id: 1, name: 'JProduct 1', category: 'Category 1', price: 9.99, stockQuantity: 10, status: 'in_stock' },
    { id: 2, name: 'Product 2', category: 'Category 2', price: 19.99, stockQuantity: 5, status: 'out_of_stock' },
    { id: 3, name: 'Product 3', category: 'Category 3', price: 29.99, stockQuantity: 0, status: 'discontinued' },
  ])

  function addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.value.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    products.value = [...products.value, newProduct]
  }

  function updateProduct(id: number, product: Partial<Product>) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value = products.value.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
    }
  }

  function deleteProduct(id: number) {
    products.value = products.value.filter(p => p.id !== id)
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  }
})