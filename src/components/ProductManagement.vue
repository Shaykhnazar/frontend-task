<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table'
import { ref, reactive, computed, h } from 'vue'
import DataTable from './DataTable.vue'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'
import Label from './ui/Label.vue'
import ConfirmActionDialog from './ConfirmActionDialog.vue'

// Types
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'manager'
  status: 'active' | 'inactive'
  lastLogin?: string
}

// Data
const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
])

const loading = ref(false)
const showUserForm = ref(false)
const showDeleteDialog = ref(false)
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)

// Form data
const userForm = reactive({
  name: '',
  email: '',
  role: 'user' as User['role'],
  status: 'active' as User['status'],
})

// Table setup
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: ({ getValue }) => {
      const role = getValue()
      const roleColors = {
        admin: 'bg-red-100 text-red-800',
        manager: 'bg-blue-100 text-blue-800',
        user: 'bg-green-100 text-green-800',
      }
      return h('span', {
        class: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[role]}`
      }, role.charAt(0).toUpperCase() + role.slice(1))
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
      }
      return h('span', {
        class: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`
      }, status.charAt(0).toUpperCase() + status.slice(1))
    },
  }),
  columnHelper.accessor('lastLogin', {
    header: 'Last Login',
    cell: ({ getValue }) => getValue() || 'Never',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { original } }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(Button, {
          variant: 'outline',
          size: 'sm',
          onClick: () => editUser(original)
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
const isEditing = computed(() => editingUser.value !== null)

// Methods
const resetForm = () => {
  userForm.name = ''
  userForm.email = ''
  userForm.role = 'user'
  userForm.status = 'active'
}

const openUserForm = () => {
  resetForm()
  editingUser.value = null
  showUserForm.value = true
}

const editUser = (user: User) => {
  editingUser.value = user
  userForm.name = user.name
  userForm.email = user.email
  userForm.role = user.role
  userForm.status = user.status
  showUserForm.value = true
}

const saveUser = () => {
  if (!userForm.name || !userForm.email) return

  loading.value = true

  // Simulate API call
  setTimeout(() => {
    if (isEditing.value && editingUser.value) {
      // Update existing user
      const index = users.value.findIndex(u => u.id === editingUser.value!.id)
      if (index !== -1) {
        users.value[index] = {
          ...editingUser.value,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status,
        }
      }
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.value.map(u => u.id)) + 1,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        lastLogin: userForm.status === 'active' ? new Date().toISOString().split('T')[0] : undefined,
      }
      users.value.push(newUser)
    }

    loading.value = false
    showUserForm.value = false
    editingUser.value = null
  }, 1000)
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  showDeleteDialog.value = true
}

const deleteUser = () => {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id)
    userToDelete.value = null
    showDeleteDialog.value = false
  }
}

const cancelDelete = () => {
  userToDelete.value = null
  showDeleteDialog.value = false
}

const cancelForm = () => {
  showUserForm.value = false
  editingUser.value = null
  resetForm()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-500">Manage users, roles, and permissions</p>
      </div>
      <Button @click="openUserForm" class="bg-blue-600 hover:bg-blue-700">
        Add New User
      </Button>
    </div>

    <!-- User Table -->
    <div class="bg-white rounded-lg shadow">
      <DataTable :data="users" :columns="columns" :loading="false" />
    </div>

    <!-- User Form Modal -->
    <div v-if="showUserForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit User' : 'Add New User' }}
        </h2>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <Label for="name">Name</Label>
            <Input id="name" v-model="userForm.name" placeholder="Enter user name" required class="mt-1" />
          </div>

          <div>
            <Label for="email">Email</Label>
            <Input id="email" v-model="userForm.email" type="email" placeholder="Enter email address" required
              class="mt-1" />
          </div>

          <div>
            <Label for="role">Role</Label>
            <select id="role" v-model="userForm.role"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <Label for="status">Status</Label>
            <select id="status" v-model="userForm.status"
              class="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <Button type="submit" :disabled="loading" class="flex-1 bg-blue-600 hover:bg-blue-700">
              {{ loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User') }}
            </Button>
            <Button type="button" variant="outline" @click="cancelForm" class="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmActionDialog v-model:open="showDeleteDialog" title="Delete User"
      :description="`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`"
      action-variant="destructive" @continue-action="deleteUser" @cancel-action="cancelDelete" />
  </div>
</template>
