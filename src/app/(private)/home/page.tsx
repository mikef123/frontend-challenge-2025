'use client'
import { useItems } from '@/hooks/useItems'
import dynamic from 'next/dynamic'

const VirtualList = dynamic(
  () => import('@/components/list/VirtualList').then((m) => m.VirtualList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded" />
        ))}
      </div>
    ),
  }
)

export default function Home() {
  const { data = [], isLoading, isError, error } = useItems()
  if (isLoading) return <p className="p-6">Loading...</p>
  if (isError)
    return <p className="p-6 text-red-600">Error: {(error as Error).message}</p>
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm opacity-70">Items: {data.length}</span>
      </div>
      {data.length === 0 ? <p>No hay datos</p> : <VirtualList items={data} />}
    </>
  )
}
