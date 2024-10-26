// ./app/api/messages/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Message from '../messages/messages';

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
