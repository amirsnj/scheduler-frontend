<template>
  <div>
    <!-- Mobile Menu Button -->
    <button 
      v-show="!isMobileMenuOpen"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg text-gray-600 hover:text-gray-800 transition-colors"
      @click="toggleMobileMenu"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Overlay for mobile -->
    <div 
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeMobileMenu"
    ></div>

    <!-- Sidebar -->
    <div 
      class="w-72 h-screen bg-white rounded-xl p-5 flex flex-col font-sans shadow-lg transition-transform duration-300 ease-in-out scrollbar-hide overflow-y-auto"
      :class="{
        'fixed lg:static z-40': true,
        'transform -translate-x-full lg:translate-x-0': !isMobileMenuOpen,
        'transform translate-x-0': isMobileMenuOpen
      }"
    >
      <!-- Header -->
      <div class="mb-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button class="p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span class="text-base font-semibold text-gray-800">Menu</span>
          </div>
          <!-- Close button for mobile -->
          <button 
            class="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            @click="closeMobileMenu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="mb-8">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">TASKS</h3>
        <ul class="space-y-0.5">
          <li 
            class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-blue-50 text-blue-600': activeItem === 'upcoming' }"
            @click="setActive('upcoming')"
          >
            <svg class="mr-3 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,11 12,14 22,4"/>
              <path d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"/>
            </svg>
            <span class="flex-1 text-sm font-medium">Upcoming</span>
            <span class="text-xs font-medium" :class="activeItem === 'upcoming' ? 'text-blue-600' : 'text-gray-400'">{{ upcomingCount }}</span>
          </li>
          <li 
            class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-blue-50 text-blue-600': activeItem === 'today' }"
            @click="setActive('today')"
          >
            <svg class="mr-3 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="flex-1 text-sm font-medium">Today</span>
            <span class="text-xs font-medium" :class="activeItem === 'today' ? 'text-blue-600' : 'text-gray-400'">{{ todayCount }}</span>
          </li>
          <li 
            class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-blue-50 text-blue-600': activeItem === 'calendar' }"
            @click="setActive('calendar')"
          >
            <svg class="mr-3 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="flex-1 text-sm font-medium">Calendar</span>
          </li>
          <li 
            class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-blue-50 text-blue-600': activeItem === 'sticky-wall' }"
            @click="setActive('sticky-wall')"
          >
            <svg class="mr-3 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            <span class="flex-1 text-sm font-medium">Sticky Wall</span>
          </li>
        </ul>
      </div>

      <!-- Lists Section -->
      <div class="mb-8">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">LISTS</h3>
        <ul class="space-y-0.5">
          <li 
            v-for="list in lists"
            :key="list.id"
            class="flex items-center px-2 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-blue-50 text-blue-600': activeItem === list.id }"
            @click="setActive(list.id)"
          >
            <div class="w-3.5 h-3.5 rounded-sm mr-3 flex-shrink-0" :class="list.color"></div>
            <span class="flex-1 text-sm font-medium">{{ list.name }}</span>
            <span class="text-xs font-medium" :class="activeItem === list.id ? 'text-blue-600' : 'text-gray-400'">{{ list.count }}</span>
          </li>
        </ul>
        <!-- Add new list button or input -->
        <div v-if="!isAddingNewList">
          <button 
            class="flex items-center px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start mt-1"
            @click="addNewList"
          >
            <svg class="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New List
          </button>
        </div>
        
        <!-- New list input form -->
        <div v-else class="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center gap-2">
            <!-- Random color indicator -->
            <div class="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
            
            <!-- Input field -->
            <input
              v-model="newListName"
              class="new-list-input flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="List name..."
              maxlength="20"
              @keydown="handleListEnter"
            />
            
            <!-- Action buttons -->
            <div class="flex items-center gap-1">
              <button
                @click="confirmNewList"
                class="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                :disabled="!newListName.trim()"
                :class="{ 'opacity-50 cursor-not-allowed': !newListName.trim() }"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </button>
              
              <button
                @click="cancelNewList"
                class="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Helper text -->
          <div class="mt-1 text-xs text-gray-400 ml-5">
            Press Enter to confirm, Esc to cancel
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="mb-8">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">TAGS</h3>
        <div class="flex flex-wrap gap-2 items-center">
          <span 
            v-for="tag in tags"
            :key="tag.id"
            class="px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all"
            :class="[
              activeTag === tag.id ? 'bg-blue-600 text-white' : [tag.bgColor, tag.textColor]
            ]"
            @click="toggleTag(tag.id)"
          >
            {{ tag.name }}
          </span>
          
          <!-- Add new tag button or input -->
          <button 
            v-if="!isAddingNewTag"
            class="px-2 py-1 text-gray-400 hover:text-gray-700 cursor-pointer text-xs rounded transition-colors"
            @click="addNewTag"
          >
            + Add Tag
          </button>
          
          <!-- New tag input form -->
          <div v-else class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200">
            <input
              v-model="newTagName"
              class="new-tag-input bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400 w-20"
              placeholder="Tag name..."
              maxlength="15"
              @keydown="handleTagEnter"
            />
            
            <button
              @click="confirmNewTag"
              class="p-0.5 text-green-600 hover:bg-green-100 rounded transition-colors"
              :disabled="!newTagName.trim()"
              :class="{ 'opacity-50 cursor-not-allowed': !newTagName.trim() }"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </button>
            
            <button
              @click="cancelNewTag"
              class="p-0.5 text-red-600 hover:bg-red-100 rounded transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-auto border-t border-gray-200 pt-4">
        <button 
          class="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start mb-1"
          @click="openSettings"
        >
          <svg class="mr-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
          </svg>
          Settings
        </button>
        <button 
          class="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start"
          @click="signOut"
        >
          <svg class="mr-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

// Types
interface ListItem {
  id: string
  name: string
  color: string
  count: number
}

interface TagItem {
  id: string
  name: string
  bgColor: string
  textColor: string
}

type MenuItem = 'upcoming' | 'today' | 'calendar' | 'sticky-wall' | string

// Events
const emit = defineEmits<{
  itemSelected: [item: MenuItem]
  tagSelected: [tag: string]
  addNewList: []
  addNewTag: []
  settingsClicked: []
  signOut: []
}>()

// Reactive data
const activeItem = ref<MenuItem>('today')
const activeTag = ref<string | null>(null)
const isMobileMenuOpen = ref<boolean>(false)

// Add new item states
const isAddingNewList = ref<boolean>(false)
const isAddingNewTag = ref<boolean>(false)
const newListName = ref<string>('')
const newTagName = ref<string>('')

// Available colors for new lists
const availableColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500']
const availableTagColors = [
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' }
]

// Counts for tasks
const upcomingCount = ref<number>(12)
const todayCount = ref<number>(5)

// Lists array
const lists = ref<ListItem[]>([
  {
    id: 'personal',
    name: 'Personal',
    color: 'bg-red-500',
    count: 2
  },
  {
    id: 'work',
    name: 'Work', 
    color: 'bg-blue-500',
    count: 6
  },
  {
    id: 'list1',
    name: 'List 1',
    color: 'bg-yellow-500',
    count: 3
  }
])

// Tags array
const tags = ref<TagItem[]>([
  {
    id: 'tag1',
    name: 'Tag 1',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  {
    id: 'tag2',
    name: 'Tag 2',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  }
])

// Methods
const setActive = (item: MenuItem): void => {
  activeItem.value = item
  emit('itemSelected', item)
  // Close mobile menu when item is selected
  if (isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

const toggleTag = (tag: string): void => {
  activeTag.value = activeTag.value === tag ? null : tag
  emit('tagSelected', tag)
}

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

const addNewList = (): void => {
  isAddingNewList.value = true
  newListName.value = ''
  // Focus on input after next tick
  nextTick(() => {
    const input = document.querySelector('.new-list-input') as HTMLInputElement
    if (input) input.focus()
  })
}

const confirmNewList = (): void => {
  if (newListName.value.trim()) {
    // Generate random color
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
    
    // Create new list
    const newList: ListItem = {
      id: `list_${Date.now()}`,
      name: newListName.value.trim(),
      color: randomColor,
      count: 0
    }
    
    lists.value.push(newList)
    emit('addNewList')
  }
  
  // Reset state
  isAddingNewList.value = false
  newListName.value = ''
}

const cancelNewList = (): void => {
  isAddingNewList.value = false
  newListName.value = ''
}

const addNewTag = (): void => {
  isAddingNewTag.value = true
  newTagName.value = ''
  // Focus on input after next tick
  nextTick(() => {
    const input = document.querySelector('.new-tag-input') as HTMLInputElement
    if (input) input.focus()
  })
}

const confirmNewTag = (): void => {
  if (newTagName.value.trim()) {
    // Generate random color
    const randomColorSet = availableTagColors[Math.floor(Math.random() * availableTagColors.length)]
    
    // Create new tag
    const newTag: TagItem = {
      id: `tag_${Date.now()}`,
      name: newTagName.value.trim(),
      bgColor: randomColorSet.bg,
      textColor: randomColorSet.text
    }
    
    tags.value.push(newTag)
    emit('addNewTag')
  }
  
  // Reset state
  isAddingNewTag.value = false
  newTagName.value = ''
}

const cancelNewTag = (): void => {
  isAddingNewTag.value = false
  newTagName.value = ''
}

// Handle Enter key for inputs
const handleListEnter = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    confirmNewList()
  } else if (event.key === 'Escape') {
    cancelNewList()
  }
}

const handleTagEnter = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    confirmNewTag()
  } else if (event.key === 'Escape') {
    cancelNewTag()
  }
}

const openSettings = (): void => {
  emit('settingsClicked')
}

const signOut = (): void => {
  emit('signOut')
}
</script>

<style scoped>
/* Hide scrollbar for webkit browsers */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>