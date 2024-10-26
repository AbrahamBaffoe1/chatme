// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongoose';
import User from '../../models/User';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  console.log('Signup API called');
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Parse the request body if needed
    // For anonymous signup, you might not need to parse anything
    // const body = await request.json(); // Uncomment if needed

    // Generate unique username and avatar (simulated AI generation)
    const username = `User_${Math.random().toString(36).substring(2, 8)}`;
    const avatar = `https://robohash.org/${uuidv4()}.png?size=50x50`;

    console.log('Generated username and avatar:', username, avatar);

    const user = new User({ username, avatar });
    await user.save();
    console.log('User saved:', user);

    return NextResponse.json({
      user: { id: user._id, username: user.username, avatar: user.avatar },
    });
  } catch (error: any) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
