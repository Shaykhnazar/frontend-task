import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'manager'
  status: 'active' | 'inactive'
  lastLogin?: string
}

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'manager', status: 'inactive', lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', lastLogin: '2024-01-16' },
  ])

  function addUser(user: Omit<User, 'id'>) {
    const newUser: User = {
      ...user,
      id: Math.max(...users.value.map(u => u.id)) + 1,
    }
    users.value.push(newUser)
  }

  function updateUser(id: number, user: Partial<User>) {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...user }
    }
  }

  function deleteUser(id: number) {
    users.value = users.value.filter(u => u.id !== id)
  }

  return {
    users,
    addUser,
    updateUser,
    deleteUser
  }
})