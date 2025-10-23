'use client'
import { Virtuoso } from 'react-virtuoso'
import Image from 'next/image'

export function VirtualList({
  items,
}: {
  items: {
    id: number
    title: string
    desc?: string
    price?: number
    image?: string
  }[]
}) {
  return (
    <div
      style={{ height: '80vh' }}
      className="bg-gray-50 rounded-xl shadow-inner p-2"
    >
      <Virtuoso
        totalCount={items.length}
        overscan={200}
        computeItemKey={(index) => items[index]?.id ?? index}
        itemContent={(index) => {
          const item = items[index]
          if (!item) return null
          return (
            <div className="flex items-start gap-4 bg-white hover:bg-gray-100 rounded-lg shadow-sm p-4 border border-gray-200 mb-2 transition">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain rounded-md border"
                  priority={index < 5}
                />
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mt-1">
                  {item.desc}
                </p>
                {item.price && (
                  <p className="text-sm font-medium text-green-600 mt-2">
                    ${item.price}
                  </p>
                )}
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
