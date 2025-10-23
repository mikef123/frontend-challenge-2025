'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api.client'
import { useAuth } from '@/context/AuthProvider'

export type Item = {
  id: number
  title: string
  price: number
  description: string
  image: string
}

type ItemsResponse = Item[] | { item?: Item[] }

async function fetchItems(): Promise<Item[]> {
  const { data } = await api.get<ItemsResponse>('/data')

  const items: Item[] = Array.isArray(data) ? data : data.item ?? []

  if (items.length >= 2000) return items
  const expanded = new Array(2000).fill(null).map((_, i) => {
    console.log(items[i])
    const src = items[i % items.length]
    return {
      ...src,
      id: i + 1,
      title: `${src.title} #${i + 1}`,
    }
  })

  return expanded
}

export function useItems() {
  const { isAuthenticated } = useAuth()

  return useQuery<Item[]>({
    queryKey: ['items', isAuthenticated],
    enabled: isAuthenticated,
    queryFn: fetchItems,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: (failureCount) => failureCount < 2,
    refetchOnWindowFocus: false,
    placeholderData: [],
  })
}
