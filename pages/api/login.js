import cookie from 'cookie'
const API_URL = process.env.API_URL

const login = async (req, res) => {
  const { identifier, password } = req.body

  if (req.method === 'POST') {
    const strapiRes = await fetch(`${API_URL}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await strapiRes.json()

    if (strapiRes.ok) {
      // @todo - set cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', String(data.jwt), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // One week
          sameSite: 'strict',
          path: '/',
        })
      )

      res.status(200).json({ user: data.user })
    } else {
      res
        .status(data.statusCode)
        .json({ message: data.message[0].messages[0].message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    return res
      .status(405)
      .json({ message: `Method ${req.method} method not allowed` })
  }
}

export default login
