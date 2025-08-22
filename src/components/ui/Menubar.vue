<script setup lang="ts">
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
} from 'reka-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const currentMenu = ref('')

const router = useRouter()
function handleClick(route: string) {
  // alert(route)
  router.push({ name: route })
}

const menuItems = [
  {
    name: 'Home', value: 'Home', route: 'home', children: [{
      name: 'Analytics Dashboard', value: 'Analytics Dashboard', route: 'analytics-dashboard'
    }]},
  { 
    name: 'Users', value: 'Users', children: [{ 
      name: 'List', value: 'List', route: 'users'
    }]
  },
  { 
    name: 'Products', value: 'Products', children: [{
      name: 'List', value: 'List', route: 'products'
    }]
  },
]
</script>

<template>
  <MenubarRoot
    v-model="currentMenu"
    class="flex bg-white p-[3px] rounded-lg border shadow-sm"
  >
    <MenubarMenu v-for="(item, index) in menuItems" :key="index" :value="item.value">
      <MenubarTrigger
        class="py-2 px-3 outline-none select-none font-semibold leading-none rounded text-grass11 text-xs flex items-center justify-between gap-[2px] data-[highlighted]:bg-green4 data-[state=open]:bg-green4"
      >
        {{ item.name }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          class="min-w-[220px] outline-none bg-white rounded-md p-[5px] border shadow-sm [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
          align="start"
          :side-offset="5"
          :align-offset="-14"
        >
          <template v-for="childItem in item.children" :key="childItem">
            <MenubarItem
              class="text-xs leading-none text-grass11 rounded flex items-center h-[25px] px-[10px] relative select-none pl-5 outline-none data-[state=open]:bg-green4 data-[state=open]:text-grass11 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-green9 data-[highlighted]:to-green10 data-[highlighted]:text-green1 data-[highlighted]:data-[state=open]:text-green1 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none"
              :value="childItem.value"
              @click="handleClick(childItem.route)"
            >
              {{ childItem.name }}
            </MenubarItem>
            <MenubarSeparator class="h-[1px] bg-green6 m-[5px]"/>
          </template>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>