-- =====================================================
-- RESTAURANT OS - PRODUCTION GRADE SAAS DATABASE
-- PostgreSQL / Supabase optimized architecture
-- =====================================================

-- =========================
-- 0. EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1. ENUMS
-- =========================
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'cooking',
  'ready',
  'completed',
  'cancelled'
);

CREATE TYPE order_type AS ENUM (
  'dine_in',
  'takeaway',
  'delivery'
);

CREATE TYPE staff_role AS ENUM (
  'owner',
  'admin',
  'manager',
  'chef',
  'waiter'
);

-- =========================
-- 2. TENANTS (RESTAURANTS)
-- =========================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,

    logo_url TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    address TEXT,

    currency TEXT DEFAULT 'USD',

    theme JSONB DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 3. USERS (AUTH BASE)
-- =========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 4. STAFF (SaaS ACCESS CONTROL)
-- =========================
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    role staff_role NOT NULL DEFAULT 'waiter',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 5. CATEGORIES
-- =========================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 6. MENU ITEMS
-- =========================
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

    name TEXT NOT NULL,
    description TEXT,

    price DECIMAL(12,2) NOT NULL,
    image_url TEXT,

    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,

    attributes JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 7. MODIFIERS (PRO LEVEL FIX)
-- =========================
CREATE TABLE modifier_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    min_selection INT DEFAULT 0,
    max_selection INT DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES modifier_groups(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    price DECIMAL(12,2) DEFAULT 0,

    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE menu_item_modifiers (
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    modifier_group_id UUID REFERENCES modifier_groups(id) ON DELETE CASCADE,

    PRIMARY KEY (menu_item_id, modifier_group_id)
);

-- =========================
-- 8. ORDERS
-- =========================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

    status order_status DEFAULT 'pending',
    type order_type DEFAULT 'dine_in',

    table_number TEXT,

    total_amount DECIMAL(12,2) NOT NULL,

    customer_name TEXT,
    customer_phone TEXT,

    comment TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 9. ORDER ITEMS
-- =========================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,

    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,

    modifiers JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 10. PAYMENTS (FUTURE PROOF SaaS)
-- =========================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

    provider TEXT, -- stripe / cloudpayments
    status TEXT,

    amount DECIMAL(12,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 11. AUDIT LOGS (CRITICAL FOR SAAS)
-- =========================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

    action TEXT,
    entity TEXT,
    entity_id UUID,

    metadata JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- 12. INDEXES (PRODUCTION CRITICAL)
-- =========================
CREATE INDEX idx_menu_tenant ON menu_items(tenant_id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_staff_tenant ON staff(tenant_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =========================
-- 13. UPDATED_AT TRIGGERS
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
  LOOP
    EXECUTE format('CREATE TRIGGER update_%s_modtime
    BEFORE UPDATE ON %s
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();', t, t);
  END LOOP;
END $$;

-- =========================
-- 14. RLS (MULTI-TENANT SECURITY)
-- =========================
-- Реальные политики применяются миграциями в supabase/migrations/ (не копируйте устаревший блок ниже как истину).
-- Кратко (prod-модель):
--   • menu_items / modifiers — публичное чтение для anon (каталог).
--   • orders / order_items — INSERT для anon отключён; гостевой заказ пишет только service_role после валидации на сервере.
--   • authenticated + staff — доступ к заказам своего tenant через подзапрос к public.staff.
--
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY ...  — см. 20260417_0001_orders.sql, 20260418_0003_modifiers.sql, 20260419_0004_staff.sql, 20260420_0005_orders_rls_service_writes.sql