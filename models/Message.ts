// models/Message.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  user: string;
  message: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
