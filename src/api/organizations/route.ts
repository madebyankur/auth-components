import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    console.log(req.url)

    if (!id) {
        return new NextResponse(
            JSON.stringify({ msg: 'User ID is required.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    try {
        const res = await fetch(
            `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${encodeURIComponent(id)}/organizations`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.AUTH0_TOKEN}`,
                    Accept: 'application/json',
                },
            }
        )

        if (!res.ok) {
            // If the response is not ok, handle the error
            throw new Error(res.statusText)
        }

        const organizations = await res.json()
        return new NextResponse(JSON.stringify(organizations), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error: any) {
        console.error('Internal error', error)
        return new NextResponse(JSON.stringify({ msg: 'Internal error.' }), {
            status: error.status || 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}
