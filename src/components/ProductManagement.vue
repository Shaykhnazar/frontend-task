<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table'
import { ref, reactive, computed, h } from 'vue'
import DataTable from './DataTable.vue'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'
import Label from './ui/Label.vue'
import ConfirmActionDialog from './ConfirmActionDialog.vue'

// Types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  status: "in_stock" | "out_of_stock" | "discontinued";
  createdAt?: string;
}

// Data
const products = ref<Product[]>([
  { id: 1, name: 'JProduct 1', category: 'Category 1', price: 9.99, stockQuantity: 10, status: 'in_stock' },
  { id: 2, name: 'Product 2', category: 'Category 2', price: 19.99, stockQuantity: 5, status: 'out_of_stock' },
  { id: 3, name: 'Product 3', category: 'Category 3', price: 29.99, stockQuantity: 0, status: 'discontinued' },
])

const loading = ref(false)
const showProductForm = ref(false)
const showDeleteDialog = ref(false)
const editingProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)

// Form data
const productForm = reactive({
  name: '',
  category: '',
  price: 0 as number,
  stockQuantity: 0 as number,
  status: 'in_stock' as Product['status'],
  createdAt: '',
})

// Table setup
const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: ({ getValue }) => {
      const category = getValue()
      const categoryColors = {
        Shoes : 'bg-red-100 text-red-800',
        Clothes : 'bg-blue-100 text-blue-800',
        Accessoires : 'bg-green-100 text-green-800',
      }
      return h('span', {
        class: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[category]}`
      }, category.charAt(0).toUpperCase() + category.slice(1))
    },
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: ({ getValue }) => {
      const price = getValue()
      return '$' + price
    },
  }),
  columnHelper.accessor('stockQuantity', {
    header: 'Stock Quantity',
    cell: ({ getValue }) => {
      const stockQuantity = getValue()
      return stockQuantity >= 10 ? stockQuantity : h('span', { class: 'text-red-500' }, stockQuantity)
    }
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusColors = {
        in_stock: 'bg-green-100 text-green-800',
        out_of_stock: 'bg-gray-100 text-gray-800',
        discontinued: 'bg-red-100 text-red-800',
      }
      return h('span', {
        class: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`
      }, status.charAt(0).toUpperCase() + status.slice(1))
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { original } }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => editProduct(original)
        }, () => 'Edit'),
        h(Button, {
          variant: 'destructive',
          size: 'sm',
          onClick: () => confirmDelete(original)
        }, () => 'Delete'),
      ])
    },
  }),
]

// Computed
const isEditing = computed(() => editingProduct.value !== null)

// Methods
const resetForm = () => {
  productForm.name = ''
  productForm.category = ''
  productForm.price = 0
  productForm.stockQuantity = 0
  productForm.status = 'in_stock'
}

const openproductForm = () => {
  resetForm()
  editingProduct.value = null
  showProductForm.value = true
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.name = product.name
  productForm.category = product.category
  productForm.price = product.price
  productForm.stockQuantity = product.stockQuantity
  productForm.status = product.status
  showProductForm.value = true
}

const saveProduct = () => {
  if (!productForm.name || !productForm.category || !productForm.price || !productForm.stockQuantity) return

  loading.value = true

  // Simulate API call
  setTimeout(() => {
    if (isEditing.value && editingProduct.value) {
      // Update existing user
      const index = products.value.findIndex(u => u.id === editingProduct.value!.id)
      if (index !== -1) {
        products.value[index] = {
          ...editingProduct.value,
          name: productForm.name,
          category: productForm.category,
          price: productForm.price,
          stockQuantity: productForm.stockQuantity,
          status: productForm.status,
        }
      }
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.value.map(u => u.id)) + 1,
        name: productForm.name,
        category: productForm.category,
        price: productForm.price,
        stockQuantity: productForm.stockQuantity,
        status: productForm.status,
        createdAt: new Date().toISOString(),
      }
      products.value.push(newProduct)
    }

    loading.value = false
    showProductForm.value = false
    editingProduct.value = null
  }, 1000)
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

const deleteUser = () => {
  if (productToDelete.value) {
    products.value = products.value.filter(u => u.id !== productToDelete.value!.id)
    productToDelete.value = null
    showDeleteDialog.value = false
  }
}

const cancelDelete = () => {
  productToDelete.value = null
  showDeleteDialog.value = false
}

const cancelForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  resetForm()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Product Management</h1>
        <p class="text-gray-500">Manage products </p>
      </div>
      <Button @click="openproductForm" class="bg-blue-600 hover:bg-blue-700">
        Add New Product
      </Button>
    </div>

    <!-- Product Table -->
    <div class="bg-white rounded-lg shadow">
      <DataTable :data="products" :columns="columns" :loading="false" />
    </div>

    <!-- User Form Modal -->
    <div v-if="showProductForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit Product' : 'Add New Product' }}
        </h2>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <Label for="name">Name</Label>
            <Input id="name" v-model="productForm.name" placeholder="Enter user name" required class="mt-1" />
          </div>

          <div>
            <Label for="category">Category</Label>
            <select name="category" id="category"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="Shoes">Shoes</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <Label for="price">Price</Label>
            <Input id="price" v-model.number="productForm.price" type="number" placeholder="Enter price" required class="mt-1" step="0.01" min="0" max="99999.99" />
          </div>

          <div>
            <Label for="stockQuantity">Stock Quantity</Label>
            <Input id="stockQuantity" v-model.number="productForm.stockQuantity" type="number"
              placeholder="Enter stock quantity" required class="mt-1" />
          </div>


          <div>
            <Label for="status">Status</Label>
            <select name="status" id="status"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <Button type="submit" :disabled="loading" class="flex-1 bg-blue-600 hover:bg-blue-700">
              {{ loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product') }}
            </Button>
            <Button type="button" variant="outline" @click="cancelForm" class="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmActionDialog v-model:open="showDeleteDialog" title="Delete Product"
      :description="`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`"
      action-variant="destructive" @continue-action="deleteUser" @cancel-action="cancelDelete" />
  </div>
</template>
