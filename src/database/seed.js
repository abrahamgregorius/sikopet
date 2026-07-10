import { db } from './db.js';
import {
  LoanStatus,
  TransactionType,
  NotificationType,
  SavingType,
} from './schema.js';
import { moduleService } from '../modules/service.js';

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export async function seedDatabase() {
  const cooperativeCount = await db.cooperatives.count();
  if (cooperativeCount > 0) {
    console.log('[Seed] Database already has data, skipping seed.');
    return false;
  }

  console.log('[Seed] Seeding demo data...');

  const cooperativeId = await db.cooperatives.add({
    name: 'Koperasi Nusantara Maju',
    address: 'Jl. Merdeka No. 45, Jakarta Selatan',
    phone: '021-7654321',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const memberIds = await db.members.bulkAdd([
    {
      cooperativeId,
      memberNumber: 'KSP-0001',
      name: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl. Melati No. 12, Jakarta',
      createdAt: daysAgo(120),
      updatedAt: daysAgo(120),
    },
    {
      cooperativeId,
      memberNumber: 'KSP-0002',
      name: 'Siti Nurhaliza',
      phone: '081234567891',
      address: 'Jl. Anggrek No. 8, Jakarta',
      createdAt: daysAgo(90),
      updatedAt: daysAgo(90),
    },
    {
      cooperativeId,
      memberNumber: 'KSP-0003',
      name: 'Ahmad Wijaya',
      phone: '081234567892',
      address: 'Jl. Mawar No. 5, Jakarta',
      createdAt: daysAgo(60),
      updatedAt: daysAgo(60),
    },
    {
      cooperativeId,
      memberNumber: 'KSP-0004',
      name: 'Dewi Lestari',
      phone: '081234567893',
      address: 'Jl. Kenanga No. 15, Jakarta',
      createdAt: daysAgo(45),
      updatedAt: daysAgo(45),
    },
    {
      cooperativeId,
      memberNumber: 'KSP-0005',
      name: 'Rudi Hermawan',
      phone: '081234567894',
      address: 'Jl. Dahlia No. 22, Jakarta',
      createdAt: daysAgo(30),
      updatedAt: daysAgo(30),
    },
  ], { allKeys: true });

  await db.savings.bulkAdd([
    { memberId: memberIds[0], amount: 5000000, type: SavingType.DEPOSIT, description: 'Simpanan wajibbulan 1', createdAt: daysAgo(115), updatedAt: daysAgo(115) },
    { memberId: memberIds[0], amount: 5000000, type: SavingType.DEPOSIT, description: 'Simpanan wajibbulan 2', createdAt: daysAgo(85), updatedAt: daysAgo(85) },
    { memberId: memberIds[1], amount: 3000000, type: SavingType.DEPOSIT, description: 'Simpanan pokok', createdAt: daysAgo(88), updatedAt: daysAgo(88) },
    { memberId: memberIds[1], amount: 2000000, type: SavingType.DEPOSIT, description: 'Simpanan wajibbulan 1', createdAt: daysAgo(58), updatedAt: daysAgo(58) },
    { memberId: memberIds[2], amount: 7500000, type: SavingType.DEPOSIT, description: 'Simpanan sukarela', createdAt: daysAgo(55), updatedAt: daysAgo(55) },
    { memberId: memberIds[3], amount: 4000000, type: SavingType.DEPOSIT, description: 'Simpanan wajibbulan 1', createdAt: daysAgo(43), updatedAt: daysAgo(43) },
    { memberId: memberIds[4], amount: 6000000, type: SavingType.DEPOSIT, description: 'Simpanan pokok', createdAt: daysAgo(28), updatedAt: daysAgo(28) },
    { memberId: memberIds[0], amount: 1000000, type: SavingType.WITHDRAWAL, description: 'Penarikan darurat', createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  ]);

  await db.loans.bulkAdd([
    {
      memberId: memberIds[0],
      principal: 10000000,
      interest: 10,
      paidAmount: 0,
      remainingAmount: 11000000,
      dueDate: daysFromNow(180),
      status: LoanStatus.ACTIVE,
      createdAt: daysAgo(30),
      updatedAt: daysAgo(30),
    },
    {
      memberId: memberIds[1],
      principal: 5000000,
      interest: 10,
      paidAmount: 5000000,
      remainingAmount: 0,
      dueDate: daysAgo(10),
      status: LoanStatus.COMPLETED,
      createdAt: daysAgo(90),
      updatedAt: daysAgo(10),
    },
    {
      memberId: memberIds[2],
      principal: 15000000,
      interest: 12,
      paidAmount: 3750000,
      remainingAmount: 13050000,
      dueDate: daysFromNow(90),
      status: LoanStatus.ACTIVE,
      createdAt: daysAgo(60),
      updatedAt: daysAgo(30),
    },
    {
      memberId: memberIds[3],
      principal: 8000000,
      interest: 10,
      paidAmount: 0,
      remainingAmount: 8800000,
      dueDate: daysAgo(5),
      status: LoanStatus.OVERDUE,
      createdAt: daysAgo(95),
      updatedAt: daysAgo(5),
    },
  ]);

  const productIds = await db.products.bulkAdd([
    { name: 'Beras Premium 5kg', category: 'Sembako', price: 75000, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Minyak Goreng 2L', category: 'Sembako', price: 32000, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Gula Pasir 1kg', category: 'Sembako', price: 15000, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Telur Ayam 1kg', category: 'Sembako', price: 28000, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Sabun Mandi 100g', category: 'Toiletries', price: 8000, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Sabun Cuci 900g', category: 'Toiletries', price: 18500, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Shampo Botol 170ml', category: 'Toiletries', price: 22000, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
    { name: 'Pasta Gigi 150g', category: 'Toiletries', price: 12500, createdAt: daysAgo(180), updatedAt: daysAgo(180) },
  ], { allKeys: true });

  await db.inventory.bulkAdd([
    { productId: productIds[0], stock: 85, minimumStock: 20, location: 'Gudang A-1', updatedAt: daysAgo(1) },
    { productId: productIds[1], stock: 120, minimumStock: 30, location: 'Gudang A-1', updatedAt: daysAgo(1) },
    { productId: productIds[2], stock: 200, minimumStock: 50, location: 'Gudang A-2', updatedAt: daysAgo(1) },
    { productId: productIds[3], stock: 75, minimumStock: 25, location: 'Gudang A-2', updatedAt: daysAgo(1) },
    { productId: productIds[4], stock: 300, minimumStock: 50, location: 'Gudang B-1', updatedAt: daysAgo(1) },
    { productId: productIds[5], stock: 150, minimumStock: 40, location: 'Gudang B-1', updatedAt: daysAgo(1) },
    { productId: productIds[6], stock: 8, minimumStock: 20, location: 'Gudang B-2', updatedAt: daysAgo(0) },
    { productId: productIds[7], stock: 95, minimumStock: 30, location: 'Gudang B-2', updatedAt: daysAgo(1) },
  ]);

  await db.transactions.bulkAdd([
    { type: TransactionType.SALE, referenceId: 'TRX-001', amount: 150000, description: 'Penjualan benih unggul', createdAt: daysAgo(14) },
    { type: TransactionType.SALE, referenceId: 'TRX-002', amount: 85000, description: 'Penjualan pupuk urea', createdAt: daysAgo(12) },
    { type: TransactionType.EXPENSE, referenceId: 'TRX-003', amount: 2500000, description: 'Gaji karyawan bulan ini', createdAt: daysAgo(10) },
    { type: TransactionType.SALE, referenceId: 'TRX-004', amount: 320000, description: 'Penjualan alat pertanian', createdAt: daysAgo(7) },
    { type: TransactionType.INCOME, referenceId: 'TRX-005', amount: 500000, description: 'Jasa pengiriman', createdAt: daysAgo(5) },
    { type: TransactionType.PURCHASE, referenceId: 'TRX-006', amount: 15000000, description: 'Pembelian stok baru', createdAt: daysAgo(3) },
    { type: TransactionType.SALE, referenceId: 'TRX-007', amount: 450000, description: 'Penjualan pestisida', createdAt: daysAgo(2) },
    { type: TransactionType.SALE, referenceId: 'TRX-008', amount: 275000, description: 'Penjualan benih padi', createdAt: daysAgo(1) },
  ]);

  await db.notifications.bulkAdd([
    {
      type: NotificationType.INFO,
      title: 'Sinkronisasi Berhasil',
      message: 'Data berhasil disinkronkan ke server. 47 record baru telah diperbarui.',
      read: false,
      createdAt: daysAgo(0),
    },
    {
      type: NotificationType.WARNING,
      title: 'Stok Menipis',
      message: 'Shampo Botol 170ml tinggal 8 unit. Segera lakukan restok.',
      read: false,
      createdAt: daysAgo(0),
    },
    {
      type: NotificationType.ERROR,
      title: 'Pinjaman Jatuh Tempo',
      message: 'Pinjaman Dewi Lestari sudah melampaui batas tempo. Total kewajiban Rp 8.800.000.',
      read: false,
      createdAt: daysAgo(1),
    },
    {
      type: NotificationType.SUCCESS,
      title: 'Pinjaman Lunas',
      message: 'Pinjaman Siti Nurhaliza sebesar Rp 5.500.000 telah lunas dibayar.',
      read: true,
      createdAt: daysAgo(10),
    },
  ]);

  await db.settings.bulkAdd([
    { key: 'cooperative_name', value: 'Koperasi Nusantara Maju' },
    { key: 'currency', value: 'IDR' },
    { key: 'locale', value: 'id-ID' },
    { key: 'theme', value: 'light' },
    { key: 'auto_sync', value: 'true' },
    { key: 'sync_interval', value: '300000' },
  ]);

  console.log('[Seed] Demo data seeded successfully.');

  await moduleService.initializeModules();

  return true;
}

export async function resetDatabase() {
  await db.delete();
  await db.open();
  await moduleService.initializeModules();
  await seedDatabase();
}
