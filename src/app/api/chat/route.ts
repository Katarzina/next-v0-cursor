import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { sendTelegramMessage } from '@/lib/telegram'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function buildSystemPrompt(): Promise<string> {
  const properties = await prisma.property.findMany({
    select: { title: true, location: true, price: true, area: true, bedrooms: true, bathrooms: true },
    take: 30,
    orderBy: { featured: 'desc' },
  })

  const listings = properties
    .map((p) => `- ${p.title} | ${p.location} | ${p.price} | ${p.bedrooms} спален, ${p.bathrooms} санузл. | ${p.area}`)
    .join('\n')

  return `You are an AI real estate consultant for PropertyFinder — a real estate agency helping clients buy and rent properties.

Your mission: understand what the visitor is looking for, capture their name and email, then confirm you'll send them matching listings.

CURRENT LISTINGS (${properties.length} properties):
${listings}

CONVERSATION RULES:
- Keep responses SHORT: 2-3 sentences maximum
- Ask only ONE question per message
- Be warm and helpful, not pushy
- Detect the user's language from their first message and respond in the SAME language throughout
- Reference real listings from the list above when relevant

FLOW:
1. After the visitor's first message, immediately ask for their name and email: "Чтобы подобрать лучшие варианты и отправить вам подборку — как вас зовут и какой email?"
2. Once you have name and email, ask 1-2 clarifying questions (location preference, budget, buy or rent)
3. Mention 1-2 relevant listings from the list above that match their request
4. Confirm you will send a personalized selection shortly

IMPORTANT: When you have collected BOTH the user's name AND email, end your final message with this exact format on a new line:
LEAD_CAPTURED:{"name":"Full Name","email":"email@example.com","summary":"one sentence about what they are looking for"}

Only reference properties from the list above. Be honest and helpful.`
}

type Message = { role: 'user' | 'model'; content: string }

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: Message[] }

  if (messages.length > 10) {
    return NextResponse.json({
      message: 'Спасибо за общение! Наш агент свяжется с вами в ближайшее время.',
      lead_captured: false,
    })
  }

  try {
    const systemPrompt = await buildSystemPrompt()
    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: (m.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: groqMessages,
    })

    const responseText = completion.choices[0].message.content ?? ''
    const leadMatch = responseText.match(/LEAD_CAPTURED:(\{[^}]+\})/)

    if (leadMatch) {
      try {
        const leadData = JSON.parse(leadMatch[1])
        const cleanMessage = responseText.replace(/LEAD_CAPTURED:\{[^}]+\}/, '').trim()

        await prisma.lead.create({
          data: {
            name: leadData.name,
            email: leadData.email,
            message: leadData.summary ?? 'Via AI chat',
            stage: 'NEW',
            source: 'WEBSITE',
          },
        })

        await sendTelegramMessage(
          `🤖 <b>AI Chat Lead!</b>\n\n👤 <b>${leadData.name}</b>\n✉️ ${leadData.email}\n\n💬 ${leadData.summary}`
        ).catch(() => {})

        return NextResponse.json({ message: cleanMessage, lead_captured: true })
      } catch {
        // JSON parse failed, continue normally
      }
    }

    return NextResponse.json({ message: responseText, lead_captured: false })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({
      message: 'Технические неполадки. Напишите нам напрямую — ответим в течение 24 часов.',
      lead_captured: false,
    })
  }
}
