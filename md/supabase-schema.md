-- SIKOPET Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- ============ IDENTITY & TENANCY ============

CREATE TABLE IF NOT EXISTS cooperative (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name TEXT NOT NULL,
address TEXT,
phone TEXT,
NIB TEXT UNIQUE,
SKAHU TEXT UNIQUE,
status TEXT DEFAULT 'draft',
modal_simpanan_pokok REAL DEFAULT 0,
modal_simpanan_wajib REAL DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user" (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
name TEXT NOT NULL,
role TEXT NOT NULL,
cooperative_id UUID REFERENCES cooperative(id),
device_id TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS member (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
member_number TEXT NOT NULL,
nik TEXT UNIQUE NOT NULL,
name TEXT NOT NULL,
phone TEXT,
address TEXT,
status TEXT DEFAULT 'active',
join_date TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_member_cooperative_deleted ON member(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS device (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES "user"(id),
device_id TEXT UNIQUE NOT NULL,
platform TEXT,
last_seen_at TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ SIMPAN PINJAM ============

CREATE TABLE IF NOT EXISTS savings_account (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
member_id UUID NOT NULL REFERENCES member(id),
type TEXT NOT NULL,
opened_at TIMESTAMPTZ DEFAULT NOW(),
status TEXT DEFAULT 'active',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_savings_account_member_status ON savings_account(member_id, status);

CREATE TABLE IF NOT EXISTS savings_mutation (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
savings_account_id UUID NOT NULL REFERENCES savings_account(id),
type TEXT NOT NULL,
amount REAL NOT NULL,
receipt_number TEXT NOT NULL,
description TEXT,
officer_id UUID REFERENCES "user"(id),
transaction_date TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_savings_mutation_account_date ON savings_mutation(savings_account_id, transaction_date);

CREATE TABLE IF NOT EXISTS loan (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
member_id UUID NOT NULL REFERENCES member(id),
principal REAL NOT NULL,
interest_rate REAL NOT NULL,
tenor_months INTEGER NOT NULL,
disbursement_date TIMESTAMPTZ,
status TEXT DEFAULT 'draft',
approved_by UUID REFERENCES "user"(id),
approved_at TIMESTAMPTZ,
notes TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_member_status ON loan(member_id, status);

CREATE TABLE IF NOT EXISTS installment_schedule (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
loan_id UUID NOT NULL REFERENCES loan(id),
installment_number INTEGER NOT NULL,
due_date TIMESTAMPTZ NOT NULL,
amount_due REAL NOT NULL,
amount_paid REAL DEFAULT 0,
status TEXT DEFAULT 'unpaid',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_installment_loan_number ON installment_schedule(loan_id, installment_number);

CREATE TABLE IF NOT EXISTS loan_payment (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
installment_schedule_id UUID NOT NULL REFERENCES installment_schedule(id),
amount REAL NOT NULL,
payment_date TIMESTAMPTZ DEFAULT NOW(),
officer_id UUID REFERENCES "user"(id),
receipt_number TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_payment_schedule_date ON loan_payment(installment_schedule_id, payment_date);

CREATE TABLE IF NOT EXISTS deposit (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
member_id UUID NOT NULL REFERENCES member(id),
principal REAL NOT NULL,
tenor_months INTEGER NOT NULL,
interest_rate REAL NOT NULL,
start_date TIMESTAMPTZ DEFAULT NOW(),
maturity_date TIMESTAMPTZ NOT NULL,
status TEXT DEFAULT 'active',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deposit_member_status ON deposit(member_id, status);

-- ============ POS & INVENTORY ============

CREATE TABLE IF NOT EXISTS product (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
category TEXT,
name TEXT NOT NULL,
unit TEXT,
purchase_price REAL,
sale_price REAL,
barcode TEXT UNIQUE,
minimum_stock INTEGER DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_product_cooperative_deleted ON product(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS supplier (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
name TEXT NOT NULL,
contact TEXT,
address TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_supplier_cooperative_deleted ON supplier(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS stock (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
product_id UUID NOT NULL REFERENCES product(id),
location TEXT,
quantity REAL DEFAULT 0,
last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_product ON stock(product_id);

CREATE TABLE IF NOT EXISTS purchase (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
supplier_id UUID NOT NULL REFERENCES supplier(id),
date TIMESTAMPTZ DEFAULT NOW(),
total_amount REAL NOT NULL,
payment_status TEXT DEFAULT 'unpaid',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_item (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
purchase_id UUID NOT NULL REFERENCES purchase(id),
product_id UUID NOT NULL REFERENCES product(id),
quantity REAL NOT NULL,
unit_price REAL NOT NULL,
subtotal REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS sale (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
cashier_id UUID NOT NULL,
date TIMESTAMPTZ DEFAULT NOW(),
total_amount REAL NOT NULL,
payment_method TEXT DEFAULT 'cash',
status TEXT DEFAULT 'completed',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sale_item (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
sale_id UUID NOT NULL REFERENCES sale(id),
product_id UUID NOT NULL REFERENCES product(id),
quantity REAL NOT NULL,
unit_price REAL NOT NULL,
subtotal REAL NOT NULL
);

-- ============ GUDANG (WAREHOUSE) ============

CREATE TABLE IF NOT EXISTS warehouse (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
name TEXT NOT NULL,
location TEXT,
capacity REAL,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_warehouse_cooperative_deleted ON warehouse(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS rack_location (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
warehouse_id UUID NOT NULL REFERENCES warehouse(id),
rack_code TEXT NOT NULL,
capacity REAL,
UNIQUE(warehouse_id, rack_code)
);

CREATE TABLE IF NOT EXISTS goods_receipt (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
warehouse_id UUID NOT NULL REFERENCES warehouse(id),
product_id UUID NOT NULL REFERENCES product(id),
quantity REAL NOT NULL,
photo_url TEXT,
receipt_date TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouse_mutation (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
product_id UUID NOT NULL REFERENCES product(id),
warehouse_id UUID NOT NULL REFERENCES warehouse(id),
type TEXT NOT NULL,
destination_warehouse_id UUID REFERENCES warehouse(id),
quantity REAL NOT NULL,
mutation_date TIMESTAMPTZ DEFAULT NOW(),
reference_number TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_warehouse_mutation_warehouse_date ON warehouse_mutation(warehouse_id, mutation_date);

CREATE TABLE IF NOT EXISTS stock_opname (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
warehouse_id UUID NOT NULL REFERENCES warehouse(id),
date TIMESTAMPTZ DEFAULT NOW(),
officer_id UUID NOT NULL REFERENCES "user"(id),
status TEXT DEFAULT 'draft',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_opname_item (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
stock_opname_id UUID NOT NULL REFERENCES stock_opname(id),
product_id UUID NOT NULL REFERENCES product(id),
system_quantity REAL NOT NULL,
physical_quantity REAL NOT NULL,
difference REAL NOT NULL
);

-- ============ LOGISTIK ============

CREATE TABLE IF NOT EXISTS vehicle (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
plate_number TEXT UNIQUE NOT NULL,
type TEXT,
capacity_kg REAL,
status TEXT DEFAULT 'active',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vehicle_cooperative_deleted ON vehicle(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS driver (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
name TEXT NOT NULL,
license_number TEXT UNIQUE NOT NULL,
phone TEXT,
status TEXT DEFAULT 'active',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_driver_cooperative_deleted ON driver(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS delivery_schedule (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
vehicle_id UUID NOT NULL REFERENCES vehicle(id),
driver_id UUID NOT NULL REFERENCES driver(id),
date TIMESTAMPTZ DEFAULT NOW(),
origin TEXT,
destination TEXT,
status TEXT DEFAULT 'draft',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_driver_date ON delivery_schedule(driver_id, date);

CREATE TABLE IF NOT EXISTS delivery_item (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
delivery_schedule_id UUID NOT NULL REFERENCES delivery_schedule(id),
product_id UUID NOT NULL REFERENCES product(id),
quantity REAL NOT NULL,
reference TEXT
);

CREATE TABLE IF NOT EXISTS appointment (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
delivery_schedule_id UUID NOT NULL REFERENCES delivery_schedule(id),
destination_address TEXT NOT NULL,
scheduled_time TIMESTAMPTZ NOT NULL,
recipient_contact TEXT,
status TEXT DEFAULT 'scheduled',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_position (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
delivery_schedule_id UUID NOT NULL REFERENCES delivery_schedule(id),
latitude REAL NOT NULL,
longitude REAL NOT NULL,
timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_schedule_timestamp ON tracking_position(delivery_schedule_id, timestamp);

CREATE TABLE IF NOT EXISTS proof_of_delivery (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
delivery_schedule_id UUID UNIQUE NOT NULL REFERENCES delivery_schedule(id),
recipient_name TEXT NOT NULL,
signature_url TEXT,
received_at TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ LEGALITAS & GOV ============

CREATE TABLE IF NOT EXISTS cooperative_profile (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID UNIQUE NOT NULL REFERENCES cooperative(id),
name TEXT NOT NULL,
address TEXT,
nib TEXT UNIQUE,
skahu TEXT UNIQUE,
legal_status TEXT,
modal_simpanan_pokok REAL,
modal_simpanan_wajib REAL,
status TEXT DEFAULT 'draft',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legal_document (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
type TEXT NOT NULL,
file_url TEXT,
verification_status TEXT DEFAULT 'unverified',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_document_cooperative_type ON legal_document(cooperative_id, type);

CREATE TABLE IF NOT EXISTS village_potential (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
commodity TEXT NOT NULL,
area_size REAL,
volume REAL,
labor_count INTEGER,
estimated_value REAL,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outlet (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
name TEXT NOT NULL,
location TEXT,
status TEXT DEFAULT 'active',
photo TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outlet_cooperative_deleted ON outlet(cooperative_id, deleted_at);

CREATE TABLE IF NOT EXISTS financing_request (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
type TEXT NOT NULL,
status TEXT DEFAULT 'draft',
submitted_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS external_verification (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
type TEXT NOT NULL,
status TEXT DEFAULT 'pending',
verified_at TIMESTAMPTZ,
reference_response JSONB,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_external_verification_cooperative_type ON external_verification(cooperative_id, type);

CREATE TABLE IF NOT EXISTS article (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID NOT NULL REFERENCES cooperative(id),
title TEXT NOT NULL,
content TEXT,
published_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ CROSS-CUTTING ============

CREATE TABLE IF NOT EXISTS outbox (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
device_id TEXT NOT NULL,
entity_type TEXT NOT NULL,
operation_type TEXT NOT NULL,
client_id TEXT NOT NULL,
payload JSONB NOT NULL,
idempotency_key TEXT UNIQUE NOT NULL,
status TEXT DEFAULT 'pending',
attempt_count INTEGER DEFAULT 0,
last_error TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbox_device_status ON outbox(device_id, status);

CREATE TABLE IF NOT EXISTS idempotency_ledger (
idempotency_key TEXT PRIMARY KEY,
processed_at TIMESTAMPTZ DEFAULT NOW(),
result_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conflict_case (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
conflict_type TEXT NOT NULL,
entity_refs JSONB NOT NULL,
status TEXT DEFAULT 'open',
resolution TEXT,
resolved_by UUID REFERENCES "user"(id),
resolved_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
cooperative_id UUID REFERENCES cooperative(id),
recipient_role TEXT,
user_id UUID REFERENCES "user"(id),
type TEXT NOT NULL,
payload JSONB NOT NULL,
read_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_log (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
actor_id UUID NOT NULL REFERENCES "user"(id),
actor_role TEXT,
entity_type TEXT NOT NULL,
entity_id TEXT NOT NULL,
action TEXT NOT NULL,
before_value JSONB,
after_value JSONB,
timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS rule_set (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
rule_id TEXT NOT NULL,
condition JSONB NOT NULL,
action JSONB NOT NULL,
version INTEGER DEFAULT 1,
module TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(rule_id, version)
);

CREATE TABLE IF NOT EXISTS setting (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
key TEXT UNIQUE NOT NULL,
value JSONB NOT NULL
);

-- ============ ENABLE RLS (Row Level Security) ============

ALTER TABLE cooperative ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE member ENABLE ROW LEVEL SECURITY;
ALTER TABLE device ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_mutation ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan ENABLE ROW LEVEL SECURITY;
ALTER TABLE installment_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE rack_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_mutation ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_opname ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_opname_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_position ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_of_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_potential ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlet ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE article ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_set ENABLE ROW LEVEL SECURITY;
ALTER TABLE setting ENABLE ROW LEVEL SECURITY;

-- ===== IDEMPOTENT COLUMN ADDITIONS =====
-- Only adds column if it doesn't already exist

DO $$ BEGIN
  ALTER TABLE member ADD COLUMN born_date DATE;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE supplier ADD COLUMN phone TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE supplier ADD COLUMN email TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE supplier ADD COLUMN category TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE loan ADD COLUMN purpose TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE sale ADD COLUMN discount_percent REAL DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE sale ADD COLUMN discount_amount REAL DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE sale ADD COLUMN tax_amount REAL DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE purchase ADD COLUMN payment_method TEXT DEFAULT 'transfer';
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE cooperative_profile ADD COLUMN phone TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE cooperative_profile ADD COLUMN email TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE cooperative_profile ADD COLUMN website TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE stock ADD COLUMN last_restock_at TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE stock ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE supplier ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE rack_location ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE stock_opname_item ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE delivery_item ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE tracking_position ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE proof_of_delivery ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE outbox ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE notification ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE activity_log ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null;
END $$;

-- ===== NEW TABLES =====

CREATE TABLE IF NOT EXISTS customer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES cooperative(id),
  name TEXT NOT NULL,
  contact TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS finance_transaction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES cooperative(id),
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT,
  reference_id UUID,
  reference_type TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID REFERENCES cooperative(id),
  label TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'open',
  done BOOLEAN DEFAULT FALSE,
  client_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_cooperative ON task(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);

-- 12. Enable updated_at trigger auto-update (PostgreSQL function)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE OR REPLACE TRIGGER update_cooperative_updated_at
  BEFORE UPDATE ON cooperative
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_user_updated_at
  BEFORE UPDATE ON "user"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_member_updated_at
  BEFORE UPDATE ON member
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_savings_account_updated_at
  BEFORE UPDATE ON savings_account
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_loan_updated_at
  BEFORE UPDATE ON loan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_installment_schedule_updated_at
  BEFORE UPDATE ON installment_schedule
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_deposit_updated_at
  BEFORE UPDATE ON deposit
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_product_updated_at
  BEFORE UPDATE ON product
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_supplier_updated_at
  BEFORE UPDATE ON supplier
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_stock_updated_at
  BEFORE UPDATE ON stock
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_purchase_updated_at
  BEFORE UPDATE ON purchase
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_sale_updated_at
  BEFORE UPDATE ON sale
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_warehouse_updated_at
  BEFORE UPDATE ON warehouse
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_rack_location_updated_at
  BEFORE UPDATE ON rack_location
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_goods_receipt_updated_at
  BEFORE UPDATE ON goods_receipt
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_warehouse_mutation_updated_at
  BEFORE UPDATE ON warehouse_mutation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_stock_opname_updated_at
  BEFORE UPDATE ON stock_opname
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_vehicle_updated_at
  BEFORE UPDATE ON vehicle
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_driver_updated_at
  BEFORE UPDATE ON driver
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_delivery_schedule_updated_at
  BEFORE UPDATE ON delivery_schedule
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_appointment_updated_at
  BEFORE UPDATE ON appointment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_outlet_updated_at
  BEFORE UPDATE ON outlet
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_financing_request_updated_at
  BEFORE UPDATE ON financing_request
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_village_potential_updated_at
  BEFORE UPDATE ON village_potential
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_legal_document_updated_at
  BEFORE UPDATE ON legal_document
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_cooperative_profile_updated_at
  BEFORE UPDATE ON cooperative_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_article_updated_at
  BEFORE UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_notification_updated_at
  BEFORE UPDATE ON notification
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_task_updated_at
  BEFORE UPDATE ON task
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Indexes on updated_at for incremental sync
CREATE INDEX IF NOT EXISTS idx_member_updated_at ON member(updated_at);
CREATE INDEX IF NOT EXISTS idx_product_updated_at ON product(updated_at);
CREATE INDEX IF NOT EXISTS idx_savings_account_updated_at ON savings_account(updated_at);
CREATE INDEX IF NOT EXISTS idx_loan_updated_at ON loan(updated_at);
CREATE INDEX IF NOT EXISTS idx_sale_updated_at ON sale(updated_at);
CREATE INDEX IF NOT EXISTS idx_notification_updated_at ON notification(updated_at);
CREATE INDEX IF NOT EXISTS idx_task_updated_at ON task(updated_at);
