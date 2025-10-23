import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 3600 },
    cache: 'force-cache',
  })
  if (!res.ok)
    return NextResponse.json({ message: 'External API error' }, { status: 502 })
  const data = await res.json()

  const item = Array.from({ length: 2000 }, (_, i) => {
    const base = data[i % data.length]
    return {
      id: i + 1,
      title: `${base.title} #${i + 1}`,
      desc: base.description,
      price: base.price,
      image: base.image,
    }
  })

  return NextResponse.json({ item }, { status: 200 })
}
