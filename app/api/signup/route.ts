// ./app/api/signup/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    await dbConnect();

    // Generate unique username and avatar (simulated AI generation)
    const username = `User_${Math.random().toString(36).substring(2, 8)}`;
    const avatar = `https://robohash.org/${uuidv4()}.png?size=50x50`;

    const user = new User({ username, avatar });
    await user.save();

    return NextResponse.json({
      user: { id: user._id, username: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
