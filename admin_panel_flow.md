Status: Planned

🏗️ 1. System Layers (архитектура админки)
Admin OS Layers:

1. CONTROL LAYER (управление)
   - меню
   - цены
   - модификаторы

2. LIVE OPERATIONS LAYER (реальное время)
   - заказы
   - кухня
   - статусы

3. INTELLIGENCE LAYER (AI + аналитика)
   - прогноз спроса
   - рекомендации
   - прибыль

4. IDENTITY LAYER (multi-tenant)
   - ресторан
   - филиалы
   - роли
👥 2. Roles System (RBAC 10/10)
type Role =
  | "owner"
  | "admin"
  | "manager"
  | "cashier"
  | "chef"
  | "waiter"
Доступы:
Role	Access
owner	всё
admin	настройки + меню
manager	заказы + аналитика
chef	kitchen view
waiter	table orders
cashier	payments
🧭 3. Admin Navigation (UX структура)
/admin
  ├── /dashboard        → бизнес overview
  ├── /live-orders      → real-time поток
  ├── /kitchen          → kitchen display system (KDS)
  ├── /menu             → управление меню
  ├── /modifiers        → добавки/комбо
  ├── /tables           → столы и залы
  ├── /analytics        → деньги, блюда, пики
  ├── /ai-insights      → AI рекомендации
  ├── /settings         → ресторан + team
📡 4. LIVE OPERATIONS FLOW (самое важное)
🔴 Flow 1: Новый заказ
Customer → Menu → Order → Supabase DB → Realtime Event → Admin OS
UI реакция:
появляется toast:
→ "New Order #128"
заказ попадает в:
/live-orders
автоматически:
звук (soft notification)
подсветка карточки
отправка в kitchen view
🔥 Flow 2: Kitchen System (KDS)
/kitchen
Состояния заказа:
pending → cooking → ready → served
UI поведение:
карточки растут сверху вниз
старые уходят вправо (archive)
новые появляются с animation: scale + fade
🧾 Flow 3: Order Lifecycle
🧠 5. AI Layer (Game Changer)
/ai-insights
Input:
все заказы
время
прибыль
популярные блюда
AI отвечает:
1. Demand Prediction
"Сегодня в 19:00 будет пик заказов плова +38%"
2. Menu Optimization
"Блюдо 'Lagman Deluxe' приносит 23% прибыли — увеличить цену на 5%"
3. Waste Reduction
"У вас переизбыток курицы — снизить закуп"
🍽️ 6. MENU MANAGEMENT FLOW
/menu
UX принцип:

👉 “Excel, но премиум и за 1 клик”

Features:
drag & drop categories
inline editing
image upload (instant preview)
toggle availability (🔥 ON/OFF)
price editing inline
Flow:
click item → edit modal → save → realtime update → public menu updates instantly
📊 7. DASHBOARD (Business Overview)
/dashboard
Cards:
Revenue today
Orders today
Avg ticket
Top dish
Peak hour
Live chart:
orders over time (real-time streaming)
🪑 8. TABLE MANAGEMENT FLOW
/tables
Table Map (drag UI)
States:
free
occupied
ordering
paying
UX:
tap table → open order
assign waiter
split bill
⚡ 9. REAL-TIME ENGINE (CRITICAL)
Tech:
Supabase Realtime OR WebSocket Layer
Events:
ORDER_CREATED
ORDER_UPDATED
ORDER_READY
TABLE_UPDATED
MENU_UPDATED
Pattern:
DB → Event Bus → UI Store → React Update
🧩 10. COMPONENT FLOW ARCHITECTURE
/components/admin/
  ├── LiveOrderCard
  ├── KitchenTicket
  ├── TableCard
  ├── RevenueChart
  ├── AiInsightCard
🔐 11. SECURITY FLOW (SaaS READY)
Multi-tenant rule:
tenant_id = auth.user.tenant_id
RLS rules:
admin sees only own restaurant
kitchen sees only orders
waiter sees only assigned tables
🧠 12. UX PRINCIPLES (10/10 LEVEL)
1. Zero-click actions

→ toggle availability without page reload

2. Real-time everything

→ no refresh button anywhere

3. Keyboard-first admin

→ hotkeys:

N = new order
M = menu
K = kitchen
4. Information hierarchy:
LIVE > MONEY > ACTION > SETTINGS
🚀 13. SYSTEM FLOW SUMMARY
Customer Side
     ↓
Order Created
     ↓
Realtime DB (Supabase)
     ↓
Event Bus
     ↓
Admin OS UI
     ↓
Kitchen + Analytics + AI