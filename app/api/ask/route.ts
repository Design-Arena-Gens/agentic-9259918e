import { NextResponse } from 'next/server';
import { answerQuestion } from '../../../lib/agent';

export const runtime = 'nodejs';
export const revalidate = 60; // cache API results for 60s where possible

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }
    const data = await answerQuestion(question.trim());
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
