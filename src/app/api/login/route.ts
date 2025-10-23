import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const VALID_EMAIL = 'user@user.com'
  const VALID_PASSWORD = 'password'
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    return NextResponse.json({
      token: 'auth_token',
      user: {
        id: 1,
        name: 'Demo User',
        email: VALID_EMAIL,
      },
    })
  }
  return NextResponse.json({ message: 'Invalid user' }, { status: 401 })
}
