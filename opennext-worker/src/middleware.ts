import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export default function middleware(request: NextRequest) {
	const allCookies = request.cookies.getAll()
	console.log({allCookies}) // => [{ name: 'nextjs', value: 'fast' }]
}
