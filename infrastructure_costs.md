Status: Planned

💸 Infrastructure Costs — Restaurant OS (SaaS Production)

File: infrastructure_costs.md
Stage: MVP → Scale → Multi-tenant SaaS
Currency: USD (реалистично для global SaaS)

🧠 0. Cost Philosophy (важно)

Мы считаем не “сервер стоит $X”, а:

Cost per restaurant (unit economics)
+
Cost per order (scaling metric)

🏗️ 1. Architecture Cost Layers
1. Frontend Delivery (Edge)
2. Backend Compute (API + Server Actions)
3. Database (Supabase Postgres)
4. Realtime Layer (WebSockets)
5. AI Layer (LLM usage)
6. Storage (images, assets)
7. Messaging (email, WhatsApp, Telegram)
8. Observability (logs, monitoring)
🌐 2. FRONTEND (Vercel Edge)
Stack:
Next.js 14 App Router
Vercel Edge Network
Cost:
Tier	Cost
Hobby	$0
Pro	$20 / month
Scale SaaS	$20–$100
Realistic production:
$20 / month (early SaaS)
$50–$150 / month (growth)
Why cheap:
static + SSR hybrid
CDN handles 95% traffic
🗄️ 3. DATABASE (Supabase Postgres)
Plan:
Tier	Cost
Free	$0
Pro	$25 / month
Scale	$100–$500
Production usage breakdown:
Core:
tenants
menu_items
orders
analytics
Cost drivers:
Realtime connections
Row level security overhead
DB size
Real SaaS estimate:
MVP: $25
10 restaurants: $25–$50
100 restaurants: $100–$300
⚡ 4. REAL-TIME SYSTEM

Supabase Realtime / WebSockets

Cost drivers:
active connections
order frequency
kitchen updates
Estimation:
Load	Cost
Low (MVP)	$0–$25
Medium	$25–$100
High (100+ restaurants)	$100–$300
Optimization rule:

Only send state diff, not full payload

🤖 5. AI LAYER (BIGGEST VARIABLE COST)
Stack:
OpenAI GPT-4o mini / Claude 3.5 Sonnet
Usage pattern:
Per restaurant per day:
20–100 AI calls
Types:
menu suggestions
upsell
analytics
chatbot
Cost per 1K requests:
Model	Cost
GPT-4o mini	~$0.15–$0.50
Claude Sonnet	~$1–$3
Real SaaS estimate:
MVP:
$10–$50 / month
Growth:
$100–$800 / month
Scale:
$1000+ / month (if heavy chatbot usage)
🖼️ 6. STORAGE (Images, Menu Photos)
Stack:
Supabase Storage / Cloudinary
Cost:
Tier	Cost
MVP	$0–$10
Growth	$10–$50
Scale	$50–$200
Optimization:
WebP/AVIF compression
lazy loading
CDN caching
📡 7. MESSAGING (EMAIL / WHATSAPP / TELEGRAM)
Services:
Resend (email)
Telegram Bot API (free)
WhatsApp Business API (Meta)
Costs:
Service	Cost
Email (Resend)	$0–$20
Telegram	$0
WhatsApp API	$0.005–$0.03 / msg
Real SaaS:
$5–$100 / month depending on traffic
📊 8. OBSERVABILITY (Monitoring)
Stack:
Vercel Analytics
Sentry
Log drains
Cost:
Tool	Cost
Vercel Analytics	$0–$20
Sentry	$0–$26
Logs	$10–$50
Total:
$10–$80 / month
🧮 9. TOTAL INFRASTRUCTURE COST
MVP (1–5 restaurants)
$50 – $150 / month
Growth (10–50 restaurants)
$150 – $600 / month
SaaS Scale (100–500 restaurants)
$500 – $3000 / month
Enterprise Scale (1000+ restaurants)
$3000 – $15,000+ / month
💰 10. UNIT ECONOMICS (самое важное)
Cost per restaurant:
MVP: $5–$20 / restaurant
Scale: $2–$10 / restaurant
Enterprise: <$5 / restaurant
Revenue target (SaaS pricing example):
Plan	Price
Basic	$29
Pro	$59
Enterprise	$199
Profit margin:
70% – 95% margin possible (classic SaaS)
⚠️ 11. REAL RISKS (what kills startups)
1. AI cost explosion

→ chatbot abuse

2. Realtime spam

→ too many order events

3. Image storage uncontrolled growth
4. Poor DB indexing (critical)
🚀 12. OPTIMIZATION STRATEGY (10/10 engineering)
Must-do:
Redis caching (optional later)
debounce AI calls
batch analytics
compress images
RLS optimized queries
edge caching for menu