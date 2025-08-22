<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useProductStore } from '../stores/products'
import { useUserStore } from '../stores/users'

interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  activeSessions: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

const productStore = useProductStore()
const userStore = useUserStore()

const analyticsData = computed<AnalyticsData>(() => ({
  totalUsers: userStore.users.filter(u => u.status === 'active').length,
  totalProducts: productStore.products.length,
  totalRevenue: productStore.products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0),
  activeSessions: Math.floor(userStore.users.filter(u => u.status === 'active').length * 0.6),
  revenueByMonth: [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 9200 },
    { month: 'Apr', revenue: 18900 },
    { month: 'May', revenue: 22100 },
    { month: 'Jun', revenue: 16700 }
  ],
}))

const loading = ref(true)
let interval: number | null = null

function loadData() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

onMounted(() => {
  loadData()
  interval = setInterval(loadData, 5000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="text-gray-500">Real-time business metrics</p>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-lg shadow animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ analyticsData.totalUsers.toLocaleString() }}</p>
            <p class="text-xs text-green-600">↗ +2.5%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h6M9 9L4 7m5 2V7m0 2h6"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Products</p>
            <p class="text-2xl font-bold text-gray-900">{{ analyticsData.totalProducts }}</p>
            <p class="text-xs text-green-600">↗ +1.2%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">${{ analyticsData.totalRevenue.toLocaleString() }}</p>
            <p class="text-xs text-green-600">↗ +8.3%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Sessions</p>
            <p class="text-2xl font-bold text-gray-900">{{ analyticsData.activeSessions }}</p>
            <p class="text-xs text-red-600">↘ -3.1%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
      <div class="h-64">
        <div class="flex items-end h-full space-x-2">
          <div v-for="item in analyticsData.revenueByMonth" :key="item.month" class="flex-1 flex flex-col items-center">
            <div 
              class="bg-blue-500 hover:bg-blue-600 transition-colors w-full rounded-t cursor-pointer relative group"
              :style="{ height: (item.revenue / 25000 * 100) + '%' }"
              :title="`${item.month}: $${item.revenue.toLocaleString()}`"
            >
              <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${{ item.revenue.toLocaleString() }}
              </div>
            </div>
            <span class="text-sm text-gray-600 mt-2">{{ item.month }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
