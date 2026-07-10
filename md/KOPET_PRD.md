<!-- @format -->

# Product Requirements Document (PRD)

# sikopet — Koperasi Terintegrasi

**Versi:** 1.0
**Status:** Draft untuk kompetisi
**Target Pengguna:** Koperasi Desa/Kelurahan Merah Putih (KDKMP)

---

## 1. Ringkasan Eksekutif

sikopet adalah platform ERP digital **hybrid offline-first** untuk KDKMP yang dirancang sebagai **replacement bagi SIMKOPDES** — Sistem Informasi Koperasi Desa yang saat ini digunakan 92,69% Koperasi Merah Putih namun sepenuhnya bergantung pada koneksi internet (cloud/web-based). sikopet mengintegrasikan seluruh cakupan fungsi SIMKOPDES (profil & legalitas koperasi, dokumen, potensi desa, permohonan pembiayaan/kemitraan, integrasi data pemerintah) **ditambah** lima unit usaha operasional yang lebih dalam — toko sembako, simpan pinjam, gudang, dan logistik — dalam satu ekosistem data yang tetap berfungsi penuh tanpa internet.

Sebagian besar aktivitas operasional harian berjalan penuh di perangkat (browser/PWA) tanpa bergantung pada koneksi internet, sementara keputusan bernilai tinggi, governance, atau yang memerlukan verifikasi sistem pemerintah eksternal (approval pinjaman besar, verifikasi legalitas, integrasi Dukcapil/Kemenkumham) tetap memerlukan koneksi ke server sebagai otoritas terpusat. Pembagian ini dijelaskan secara eksplisit di **Bagian 6**.

**Masalah yang diselesaikan:** SIMKOPDES sebagai sistem wajib saat ini gagal diadopsi optimal di wilayah dengan konektivitas terbatas — misalnya di Jawa Timur, dari 8.494 KDMP terdapat 216 koperasi di area blankspot, dan baru 10 koperasi yang berhasil memperbarui data microsite akibat keterbatasan jaringan dan SDM. Selain itu, koperasi di wilayah dengan konektivitas terbatas masih bergantung pada pencatatan manual (Excel/kertas) untuk operasional harian yang tidak tercakup mendalam oleh SIMKOPDES (POS, gudang, logistik), menyebabkan data terfragmentasi, sulit diawasi, dan lambat diambil keputusan.

**Solusi:** single source of truth yang tetap dapat dioperasikan offline, dengan mekanisme sinkronisasi dan penyelesaian konflik yang disesuaikan dengan sensitivitas tiap jenis data (finansial vs master vs penjadwalan vs legalitas), sekaligus tetap terhubung ke ekosistem integrasi pemerintah yang sudah dibangun SIMKOPDES (Dukcapil, Kemenkumham/AHU, DJP, Agrinas, Bank Himbara) agar proses transisi/migrasi tidak memutus akses koperasi terhadap program pemerintah.

---

## 2. Tujuan Produk

| Tujuan                                                              | Metrik Keberhasilan                                                                      |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Menghilangkan ketergantungan pada pencatatan manual                 | % transaksi tercatat digital vs manual                                                   |
| Menjamin kontinuitas operasional tanpa internet                     | Uptime fungsional device saat offline: 100% fitur inti tersedia                          |
| Meningkatkan transparansi ke BA/PMO                                 | Waktu rata-rata data sampai ke dashboard pusat setelah online                            |
| Mendukung pengambilan keputusan berbasis data                       | Jumlah insight/alert yang ditindaklanjuti BA per bulan                                   |
| Menggantikan SIMKOPDES tanpa memutus akses program pemerintah       | % koperasi bermigrasi dari SIMKOPDES tanpa kehilangan status verifikasi/akses pembiayaan |
| Menjangkau koperasi di area blankspot yang gagal diadopsi SIMKOPDES | % koperasi di area blankspot yang berhasil aktif menggunakan sikopet                     |

---

## 3. Lingkup Produk

### 3.1 Dalam Lingkup (In Scope)

- Modul Toko Sembako (POS + Inventory)
- Modul Simpan Pinjam (Simpanan, Deposito, Angsuran)
- Modul Gudang (Warehouse Management)
- Modul Logistik (Kendaraan, Sopir, Appointment)
- **Modul Legalitas, Profil & Integrasi Pemerintah (menggantikan fungsi microsite SIMKOPDES)**
- Sync Engine offline-first
- AI Cache / Local Rules Engine
- Dashboard bertingkat (Anggota, Pengurus, BA, PMO, Dinas/Kementerian)
- Migrasi data dari SIMKOPDES eksisting

### 3.2 Di Luar Lingkup (Out of Scope — Fase Ini)

- Business Matching Platform (buyer/offtaker marketplace)
- Village Potential Aggregator lintas-desa
- Live GPS tracking real-time (hanya batch position update)
- Integrasi pembayaran digital pihak ketiga (fase selanjutnya)
- Proses pendirian badan hukum koperasi baru dari nol (akta & pengesahan Kemenkumham) — sikopet menangani profil koperasi yang **sudah berbadan hukum**; pendirian baru tetap melalui jalur notaris/AHU yang berlaku

---

## 4. Arsitektur Sistem

```
+------------------------------+
| Browser (PWA)                |
|                              |
| React                        |
| Zustand                      |
| TanStack Query               |
| Dexie (IndexedDB)            |
| Sync Engine                  |
| AI Cache / Local Rules       |
|                              |
| 95% logic berjalan di sini   |
+------------------------------+
               |
     jika internet tersedia
               v
+------------------------------+
| Laravel API                  |
|                              |
| Auth                         |
| Batch Sync                   |
| AI Endpoint                  |
| Dashboard BA/PMO             |
+------------------------------+
               |
               v
          PostgreSQL
```

### 4.1 Prinsip Desain

1. **Offline-first untuk aktivitas berfrekuensi tinggi, online-required untuk keputusan bernilai tinggi** — bukan semua fitur wajib offline. Fitur yang sering terjadi di lapangan dan menunda pencatatannya merugikan (transaksi POS, mutasi stok, setor/tarik simpanan) harus berfungsi penuh tanpa internet. Fitur yang jarang terjadi namun berisiko tinggi bila salah (approval pinjaman besar, pembuatan data master, perubahan rule AI) sengaja dibuat **online-required** demi kontrol dan governance terpusat (lihat klasifikasi lengkap di Bagian 6.1).
2. **Client-generated ID (UUID/ULID)** — menghindari konflik ID saat banyak device membuat data secara bersamaan tanpa koordinasi server.
3. **Strategi sync berbeda per sensitivitas data** — data uang tidak diperlakukan sama seperti data master atau data penjadwalan (lihat Bagian 6).
4. **Kecerdasan yang di-cache, bukan live** — AI/analitik berat dijalankan di server secara periodik, hasilnya (rule set) di-cache ke client untuk evaluasi ringan tanpa koneksi.

---

## 5. Modul Produk

### 5.1 Toko Sembako (POS + Inventory)

**Tujuan:** mendukung transaksi jual-beli harian di outlet koperasi dan pengelolaan stok barang dagangan.

**Fitur Utama:**
| Fitur | Mode |
|---|---|
| Kasir POS (scan barcode via kamera, input manual, cetak struk thermal) | 🟢 Offline-First |
| Pelacakan stok berbasis pergerakan (masuk/keluar) | 🟢 Offline-First |
| Alert stok menipis & rekomendasi restock | 🟢 Offline-First (evaluasi dari rule cache lokal) |
| Pencatatan pembelian dari supplier terdaftar | 🟢 Offline-First |
| Pendaftaran produk baru & supplier baru | 🔵 Online-Required (governance data master, hindari duplikasi/inkonsistensi kode barang antar device) |
| Perubahan harga jual acuan koperasi | 🟡 Hybrid (kasir bisa override harga offline sebagai draft; harga acuan resmi hanya final setelah tersinkron) |

_Legenda: 🟢 Offline-First (berfungsi penuh tanpa internet) · 🔵 Online-Required (butuh koneksi untuk difinalisasi) · 🟡 Hybrid (bisa dimulai offline, final setelah sync)._

**User Story:**

- Sebagai **kasir**, saya ingin tetap bisa memproses transaksi penjualan dan mencetak struk meski tidak ada sinyal internet, sehingga pelayanan ke pembeli tidak terhambat.
- Sebagai **kasir**, saya ingin sistem memperingatkan saat stok barang menipis, sehingga saya bisa mengingatkan pengurus untuk restock sebelum kehabisan.
- Sebagai **pengurus koperasi**, saya ingin mendaftarkan produk atau supplier baru melalui proses yang tervalidasi server, sehingga tidak terjadi duplikasi kode barang antar outlet/device.
- Sebagai **BA**, saya ingin melihat kasus stok negatif (oversell) yang terjadi akibat transaksi offline bersamaan, sehingga saya bisa membantu pengurus menyelesaikannya dengan adil.

**Entitas Data:**
| Entitas | Field Kunci |
|---|---|
| `Barang` | id, kategori, nama, satuan, harga_beli, harga_jual, barcode, stok_minimum |
| `StokBarang` | id, barang_id, qty, lokasi, tanggal_update |
| `PenjualanPOS` | id, kasir_id, tanggal, total, metode_bayar, status |
| `ItemPenjualan` | id, penjualan_id, barang_id, qty, harga_satuan, subtotal |
| `PembelianBarang` | id, supplier_id, tanggal, total, status_bayar |

**Catatan Offline-First:**

- Transaksi POS ditulis ke Dexie terlebih dahulu; struk dicetak dari data lokal.
- Stok dihitung dari agregasi pergerakan (ledger), bukan angka yang di-overwrite.
- Kasus oversell (2 device menjual stok terakhir yang sama saat offline) tidak dibatalkan otomatis — di-flag ke dashboard BA untuk keputusan bisnis (retur/kompensasi).

**Local Rules:**

- Alert `stok < stok_minimum`
- Rekomendasi restock berdasarkan kecepatan jual historis
- Deteksi harga jual di bawah harga beli (human error input)

---

### 5.2 Simpan Pinjam (Simpanan, Deposito, Angsuran)

**Tujuan:** mengelola unit usaha keuangan koperasi — tabungan anggota, deposito berjangka, dan kredit/pinjaman.

**Fitur Utama:**
| Fitur | Mode |
|---|---|
| Setor & tarik simpanan harian | 🟢 Offline-First |
| Pencatatan pembayaran angsuran | 🟢 Offline-First |
| Notifikasi jatuh tempo & tunggakan | 🟢 Offline-First (evaluasi dari rule cache lokal) |
| Pembukaan rekening simpanan/deposito baru | 🔵 Online-Required (verifikasi identitas & governance anggota) |
| Pengajuan pinjaman (draft) | 🟢 Offline-First (dicatat sebagai draft, belum final) |
| **Approval & pencairan pinjaman** (terutama plafon besar) | 🔵 Online-Required — **wajib**, tidak boleh final offline untuk mencegah fraud/kesalahan tanpa pengawasan |
| Perhitungan bunga & penyusunan jadwal angsuran | 🔵 Online-Required (dihitung server, hasil di-push ke client untuk dilihat offline) |

_Legenda: 🟢 Offline-First (berfungsi penuh tanpa internet) · 🔵 Online-Required (butuh koneksi untuk difinalisasi) · 🟡 Hybrid (bisa dimulai offline, final setelah sync)._

**User Story:**

- Sebagai **petugas lapangan**, saya ingin mencatat setoran atau pembayaran angsuran anggota langsung di lokasi tanpa sinyal, sehingga saya tidak perlu menunda pencatatan sampai kembali ke kantor.
- Sebagai **anggota koperasi**, saya ingin melihat jadwal angsuran dan status jatuh tempo saya kapan saja, sehingga saya bisa mempersiapkan pembayaran tepat waktu.
- Sebagai **pengurus koperasi**, saya ingin mengajukan pinjaman anggota sebagai draft meski sedang offline, sehingga proses tidak tertunda hanya karena sinyal.
- Sebagai **Business Assistant (BA)**, saya ingin approval pinjaman dengan plafon besar hanya bisa final setelah saya meninjau data tersinkron, sehingga tidak ada pencairan dana yang tidak diawasi.
- Sebagai **PMO**, saya ingin melihat daftar pengajuan pinjaman yang masih berstatus "pending approval", sehingga saya bisa memastikan tidak ada yang tertahan terlalu lama.

**Entitas Data:**
| Entitas | Field Kunci |
|---|---|
| `RekeningSimpanan` | id, anggota_id, jenis (pokok/wajib/sukarela), saldo, tanggal_buka |
| `MutasiSimpanan` | id, rekening_id, tipe (setor/tarik), jumlah, tanggal, petugas_id |
| `Deposito` | id, anggota_id, jumlah_pokok, tenor_bulan, bunga_persen, tanggal_mulai, status |
| `Pinjaman` | id, anggota_id, plafon, bunga_persen, tenor_bulan, tanggal_cair, status |
| `JadwalAngsuran` | id, pinjaman_id, cicilan_ke, jatuh_tempo, jumlah_wajib, status |
| `PembayaranAngsuran` | id, jadwal_id, jumlah_dibayar, tanggal_bayar, petugas_id |

**Catatan Offline-First:**

- **Wajib append-only ledger** — saldo simpanan/pinjaman selalu dihitung dari `SUM(mutasi)`, tidak pernah disimpan sebagai kolom yang di-update langsung. Ini penting untuk audit BA/PMO/auditor eksternal.
- Setiap mutasi memerlukan **nomor kuitansi fisik unik** yang divalidasi saat sync untuk mendeteksi duplikasi pencatatan (bukan duplikasi nominal, tapi duplikasi kejadian).
- Perhitungan bunga & jatuh tempo dilakukan **server-side** saat sync (butuh presisi & aturan bisnis terpusat); jadwal angsuran hasil precompute di-push ke client agar tetap terlihat offline.
- Approval pinjaman dengan plafon besar **tidak final** secara offline — berstatus "pending approval" hingga tersinkron dan disetujui BA, untuk mencegah fraud/kesalahan tanpa pengawasan.

**Local Rules:**

- Notifikasi jatuh tempo H-3
- Deteksi anggota dengan tren tunggakan
- Rekomendasi plafon berdasarkan histori simpanan

---

### 5.3 Gudang (Warehouse Management)

**Tujuan:** mengelola stok skala besar — penerimaan barang dari petani/produsen, penyimpanan, dan distribusi ke toko/buyer.

**Fitur Utama:**
| Fitur | Mode |
|---|---|
| Penerimaan barang dengan QC + foto bukti | 🟢 Offline-First (foto diunggah lewat antrian terpisah) |
| Transfer stok antar gudang/toko | 🟢 Offline-First (eventual consistency saat sync) |
| Input stok opname (physical count) | 🟢 Offline-First |
| Persetujuan koreksi stok opname bernilai besar | 🔵 Online-Required (selisih signifikan perlu ditinjau BA sebelum menjadi entri resmi) |
| Pembuatan gudang/lokasi rak baru | 🔵 Online-Required (governance data master) |

_Legenda: 🟢 Offline-First (berfungsi penuh tanpa internet) · 🔵 Online-Required (butuh koneksi untuk difinalisasi) · 🟡 Hybrid (bisa dimulai offline, final setelah sync)._

**User Story:**

- Sebagai **petugas gudang**, saya ingin mencatat penerimaan barang beserta foto kondisinya langsung saat barang datang, meski gudang berada di lokasi tanpa sinyal, sehingga tidak ada penundaan pencatatan.
- Sebagai **petugas gudang**, saya ingin melakukan transfer stok ke gudang/toko lain secara offline, sehingga operasional distribusi tidak terhenti karena koneksi.
- Sebagai **petugas gudang**, saya ingin melakukan stok opname dan mencatat selisih stok sistem vs fisik, sehingga data stok tetap akurat dari waktu ke waktu.
- Sebagai **BA**, saya ingin meninjau dan menyetujui koreksi stok opname yang selisihnya besar/mencurigakan, sehingga potensi kebocoran atau kesalahan bisa terdeteksi sebelum menjadi catatan resmi.

**Entitas Data:**
| Entitas | Field Kunci |
|---|---|
| `Gudang` | id, nama, lokasi, kapasitas |
| `LokasiRak` | id, gudang_id, kode_rak, kapasitas |
| `PenerimaanBarang` | id, gudang_id, supplier_id, tanggal, no_surat_jalan, status_qc |
| `ItemPenerimaan` | id, penerimaan_id, barang_id, qty, satuan, kondisi |
| `MutasiGudang` | id, barang_id, tipe (masuk/keluar/transfer/opname), qty, gudang_asal, gudang_tujuan, tanggal |
| `StokOpname` | id, gudang_id, tanggal, petugas_id, status |
| `ItemOpname` | id, opname_id, barang_id, qty_sistem, qty_fisik, selisih |

**Catatan Offline-First:**

- Stok gudang = ledger dari `MutasiGudang`, konsisten dengan pola stok toko.
- Stok opname adalah entri **koreksi resmi** yang disetujui petugas — sistem tidak diam-diam menyesuaikan angka saat ada selisih akibat drift sync.
- Transfer antar gudang bersifat **eventual consistency** — sistem menoleransi urutan pencatatan yang tidak selalu sinkron (gudang tujuan bisa mencatat "diterima" sebelum gudang asal sync "dikirim").
- Foto bukti QC disimpan sebagai blob lokal (IndexedDB), diunggah lewat **antrian terpisah** dari data transaksi agar tidak memblokir sync data penting.

**Local Rules:**

- Alert kapasitas gudang mendekati penuh
- Rekomendasi rotasi stok (FIFO/FEFO untuk barang mudah rusak)
- Deteksi selisih stok opname yang mencurigakan (potensi kebocoran)

---

### 5.4 Logistik (Kendaraan, Sopir, Appointment)

**Tujuan:** mengelola armada distribusi — penjadwalan pengiriman, penugasan sopir/kendaraan, dan appointment dengan tujuan.

**Fitur Utama:**
| Fitur | Mode |
|---|---|
| Melihat jadwal & appointment yang sudah di-preload | 🟢 Offline-First |
| Bukti terima (tanda tangan digital & foto) | 🟢 Offline-First (status "delivered (pending sync)" sampai terkonfirmasi) |
| Update posisi berkala (non-real-time) | 🟢 Offline-First (dicatat lokal, di-batch upload) |
| Pendaftaran kendaraan/sopir baru | 🔵 Online-Required (governance data master) |
| Pembuatan jadwal/appointment baru yang mengalokasikan kendaraan | 🟡 Hybrid (bisa dibuat offline sebagai draft, tapi dikonfirmasi final saat sync untuk mendeteksi bentrok alokasi kendaraan) |

_Legenda: 🟢 Offline-First (berfungsi penuh tanpa internet) · 🔵 Online-Required (butuh koneksi untuk difinalisasi) · 🟡 Hybrid (bisa dimulai offline, final setelah sync)._

**User Story:**

- Sebagai **sopir**, saya ingin melihat seluruh jadwal pengiriman dan appointment hari ini yang sudah dimuat sebelum berangkat, sehingga saya tetap tahu tujuan meski tidak ada sinyal di jalan.
- Sebagai **sopir**, saya ingin mengumpulkan tanda tangan dan foto bukti terima langsung di lokasi pengiriman, sehingga proses serah terima tidak tertunda menunggu sinyal.
- Sebagai **koordinator logistik**, saya ingin membuat jadwal pengiriman baru meski sedang offline, dengan pemberitahuan jika ternyata kendaraan yang sama sudah dialokasikan device lain, sehingga saya bisa menjadwalkan ulang dengan cepat.
- Sebagai **BA/PMO**, saya ingin melihat notifikasi appointment yang bentrok alokasi kendaraannya, sehingga saya bisa membantu realokasi secara manual.

**Entitas Data:**
| Entitas | Field Kunci |
|---|---|
| `Kendaraan` | id, plat_nomor, jenis, kapasitas_kg, status |
| `Sopir` | id, nama, no_sim, status_aktif |
| `JadwalPengiriman` | id, kendaraan_id, sopir_id, tanggal, asal, tujuan, status |
| `ItemPengiriman` | id, jadwal_id, barang_id, qty, referensi |
| `Appointment` | id, jadwal_id, lokasi_tujuan, waktu_janji, kontak_penerima, status |
| `TrackingPosisi` | id, jadwal_id, latitude, longitude, timestamp |
| `BuktiTerima` | id, jadwal_id, nama_penerima, tanda_tangan, waktu_terima |

**Catatan Offline-First:**

- Jadwal & appointment untuk hari berjalan **di-preload** ke device sopir sebelum berangkat (bagian dari batch sync pagi), bukan fetch on-demand di jalan.
- Bukti terima (tanda tangan/foto) disimpan lokal dulu; status berubah menjadi "delivered (pending sync)" hingga terkonfirmasi server.
- Update posisi GPS dicatat berkala (mis. tiap 5 menit) dan di-batch upload — bukan live tracking konstan.
- **Konflik penjadwalan kendaraan** (2 device menjadwalkan kendaraan sama pada waktu sama) memerlukan **1 pemenang pasti** karena kendaraan fisik tidak bisa dipakai ganda → terdeteksi saat sync, ditandai "perlu reschedule", dieskalasi ke BA/PMO untuk realokasi manual.

**Local Rules:**

- Rekomendasi rute/urutan pengiriman berdasarkan riwayat
- Alert kendaraan due maintenance
- Deteksi appointment yang berulang kali gagal/reschedule

---

### 5.5 Legalitas, Profil & Integrasi Pemerintah (Microsite)

**Tujuan:** menggantikan fungsi microsite dan core registrasi SIMKOPDES — mengelola profil legal koperasi, dokumen, potensi desa, permohonan pembiayaan/kemitraan, serta menjaga koperasi tetap terhubung ke integrasi data pemerintah (Dukcapil, Kemenkumham/AHU, DJP, Agrinas, Bank Himbara) yang menjadi syarat akses program nasional.

**Fitur Utama:**
| Fitur | Mode |
|---|---|
| Pengisian/pengeditan profil koperasi (nama, alamat, kedudukan hukum, modal simpanan pokok/wajib) | 🟡 Hybrid (draft offline, resmi setelah tersinkron) |
| Pemotretan & unggah dokumen legal (akta pendirian, SKAHU, NPWP, berita acara musyawarah desa, NIB) | 🟢 Offline-First untuk penangkapan/capture; status verifikasi tetap 🔵 Online-Required |
| Pendataan potensi desa (komoditas, luas area, volume, jumlah SDM, estimasi nilai ekonomi) | 🟢 Offline-First (petugas survei sering berada di lokasi tanpa sinyal) |
| Manajemen gerai/outlet (daftar, status aktif, foto) | 🟡 Hybrid |
| Verifikasi NIK pengurus/anggota (integrasi Dukcapil) | 🔵 Online-Required — wajib panggilan API eksternal real-time |
| Verifikasi akta & NPAK notaris (integrasi Kemenkumham/Sistem AHU) | 🔵 Online-Required |
| Sinkronisasi data pajak (DJP) & data lahan (Agrinas) | 🔵 Online-Required |
| Formulir permohonan (akun bank, proposal bisnis, pembiayaan ke Bank Himbara) | 🟡 Hybrid (draft offline, submit final saat online) |
| Microsite publik (identitas digital koperasi untuk mitra/investor) | 🔵 Online-Required — halaman publik yang harus selalu tersaji live di server |
| Artikel/berita kegiatan koperasi (CMS ringan) | 🟡 Hybrid (tulis draft offline, publish saat online) |
| Ekspor/pelaporan data agregat ke dashboard nasional Kemenkop | 🔵 Online-Required |

_Legenda: 🟢 Offline-First (berfungsi penuh tanpa internet) · 🔵 Online-Required (butuh koneksi untuk difinalisasi) · 🟡 Hybrid (bisa dimulai offline, final setelah sync)._

**Catatan Khusus:** Modul ini secara struktural **paling condong ke online-required** dibanding empat modul operasional lainnya, karena sifat datanya berupa verifikasi identitas/legalitas yang inherently membutuhkan panggilan ke sistem pemerintah eksternal (Dukcapil, AHU Kemenkumham, DJP, Agrinas) yang tidak mungkin divalidasi secara offline. Yang offline-first di modul ini hanya tahap **penangkapan data awal** (isi form draft, foto dokumen, catat potensi desa di lapangan) — bukan tahap finalisasi/verifikasinya.

**User Story:**

- Sebagai **pengurus koperasi**, saya ingin mengisi profil dan data legal koperasi sebagai draft meski berada di lokasi dengan sinyal terbatas, sehingga saya tidak perlu menunggu koneksi stabil untuk memulai proses registrasi/pembaruan data.
- Sebagai **pengurus koperasi**, saya ingin memfoto dan mengunggah dokumen legal (akta, SKAHU, NPWP) langsung dari lapangan, sehingga proses verifikasi bisa langsung berjalan begitu perangkat kembali online.
- Sebagai **petugas survei/BA**, saya ingin mencatat data potensi desa (komoditas, luas lahan, jumlah SDM) langsung di lokasi tanpa sinyal, sehingga pendataan potensi desa tidak tertunda oleh keterbatasan jaringan — mengatasi masalah yang menyebabkan rendahnya keterisian microsite SIMKOPDES di area blankspot.
- Sebagai **pengurus koperasi**, saya ingin mengajukan permohonan pembiayaan ke Bank Himbara melalui platform yang sama dengan yang saya pakai untuk operasional harian, sehingga saya tidak perlu berpindah aplikasi atau mengulang input data.
- Sebagai **Dinas Koperasi/Kementerian**, saya ingin melihat data koperasi yang sudah terverifikasi dengan Dukcapil dan Kemenkumham secara real-time di dashboard PMO, sehingga pengawasan dan audit lebih akurat dan cepat.
- Sebagai **calon mitra/investor**, saya ingin melihat microsite publik koperasi yang menampilkan legalitas, potensi desa, dan produk unggulan, sehingga saya bisa menilai kelayakan kemitraan tanpa perlu menghubungi pengurus secara langsung.

**Entitas Data:**
| Entitas | Field Kunci |
|---|---|
| `ProfilKoperasi` | id, nama, alamat, NIB, SKAHU, kedudukan_hukum, modal_simpanan_pokok, modal_simpanan_wajib |
| `DokumenLegal` | id, koperasi_id, jenis (akta/SKAHU/NPWP/berita_acara/NIB), file_url, status_verifikasi |
| `PotensiDesa` | id, koperasi_id, komoditas, luas_area, volume, jumlah_sdm, estimasi_nilai_rp |
| `GeraiOutlet` | id, koperasi_id, nama, lokasi, status_aktif, foto |
| `PermohonanPembiayaan` | id, koperasi_id, jenis (akun_bank/proposal_bisnis/pembiayaan), status, tanggal_ajuan |
| `VerifikasiEksternal` | id, koperasi_id, jenis (NIK_dukcapil/NPAK_kemenkumham/pajak_djp/lahan_agrinas), status, tanggal_verifikasi, referensi_response |
| `ArtikelKoperasi` | id, koperasi_id, judul, konten, tanggal_publish |

---

## 6. Sync Engine & Strategi Resolusi Konflik

### 6.1 Klasifikasi Fitur: Offline-First vs Online-Required

Tidak semua fitur sikopet dirancang offline-first. Pemaksaan seluruh fitur menjadi offline-first justru menambah kompleksitas rekayasa (setiap fitur butuh strategi conflict resolution & testing sendiri) dan risiko keamanan (data sensitif ter-cache di device yang berpotensi hilang/dicuri), tanpa manfaat sepadan untuk fitur yang jarang terjadi atau berisiko tinggi bila salah. Klasifikasi dasarnya:

| Kriteria                          | Offline-First 🟢                                    | Online-Required 🔵                                   |
| --------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Frekuensi kejadian                | Tinggi (harian, berkali-kali)                       | Rendah (mingguan/bulanan atau insidental)            |
| Dampak bila tertunda              | Kerugian nyata (transaksi batal, layanan terhambat) | Dapat ditunda tanpa kerugian berarti                 |
| Risiko bila keliru/disalahgunakan | Rendah–sedang (bisa dikoreksi lewat entri baru)     | Tinggi (fraud, data ganda, keputusan keuangan besar) |
| Kebutuhan otoritas terpusat       | Rendah (device cukup mandiri)                       | Tinggi (perlu 1 sumber kebenaran)                    |

**Contoh penerapan lintas modul:**

| Kategori                     | Contoh Fitur                                                                                                                                                                                                                                                                                                   | Alasan                                                                                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🟢 Wajib Offline-First       | Transaksi POS, mutasi stok, setor/tarik simpanan & pembayaran angsuran harian, penerimaan barang gudang, bukti terima logistik, pendataan potensi desa di lapangan                                                                                                                                             | Terjadi berkali-kali sehari di lokasi dengan sinyal tidak menentu; menunda pencatatan = kerugian langsung                                                                      |
| 🔵 Sebaiknya Online-Required | Approval pinjaman plafon besar, pembuatan data master baru (koperasi/anggota/produk/kendaraan/gudang baru), perubahan rule set AI, pelaporan ke pihak eksternal/regulator, **verifikasi NIK/NPAK/pajak/lahan ke sistem pemerintah (Dukcapil, Kemenkumham/AHU, DJP, Agrinas)**, microsite publik                | Jarang terjadi, berisiko tinggi bila salah, dan butuh 1 sumber kebenaran terpusat — atau secara teknis memang harus memanggil API eksternal yang tidak bisa divalidasi offline |
| 🟡 Hybrid                    | Pengajuan pinjaman (draft offline, approval online), penjadwalan appointment kendaraan (draft offline, konfirmasi final online), perubahan harga jual acuan (override lokal, resmi setelah sync), **pengisian profil koperasi & unggah dokumen legal (draft/capture offline, finalisasi & verifikasi online)** | Bisa dimulai tanpa internet demi kecepatan, tapi baru dianggap final/sah setelah tersinkron dan divalidasi server                                                              |

Detail penandaan per fitur ada di tabel "Fitur Utama" masing-masing modul (Bagian 5.1–5.4).

### 6.2 Strategi Sync per Kategori Data

Strategi sync **tidak seragam** — disesuaikan dengan sifat data:

| Kategori Data                  | Contoh                                         | Strategi                                                                                                          |
| ------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Finansial & stok (append-only) | Mutasi simpanan, angsuran, pergerakan stok     | **Append-only ledger** — tidak pernah overwrite; saldo = agregasi. Semua entri offline valid dan digabung (union) |
| Data master/profil             | Koperasi, anggota, produk, kendaraan           | **Last-Write-Wins + version vector**; field-level merge bila field yang diubah berbeda                            |
| Butuh 1 pemenang pasti         | Appointment kendaraan, approval pinjaman besar | **Deteksi konflik → flag untuk review manual**, tidak auto-resolve                                                |
| File berat                     | Foto QC, tanda tangan POD                      | Antrian upload terpisah, tidak memblokir sync data transaksi                                                      |

### 6.3 Alur Teknis Sync

1. Semua mutasi lokal ditulis ke Dexie **dan** dimasukkan ke tabel `outbox` (antrian).
2. Sync Engine (background, memantau `navigator.onLine`, dengan retry backoff) mengambil batch dari `outbox`.
3. `POST /api/sync/batch` dengan `idempotency_key` per item (client_id + operation_type) untuk mencegah duplikasi saat retry.
4. Laravel API memvalidasi tiap item: cek idempotency, jalankan business rule validation, insert/merge sesuai strategi kategori data.
5. Response berisi status per-item: `synced` / `rejected` / `conflict`.
6. Client memperbarui `sync_status` masing-masing record.
7. Item `conflict` masuk antrian review dan memicu notifikasi ke dashboard BA/PMO.

### 6.4 Skema Metadata Sync (di setiap tabel)

```
sync_status : 'pending' | 'synced' | 'conflict'
client_id   : uuid (dibuat di device — primary key permanen)
created_at  : timestamp lokal device
updated_at  : timestamp lokal device
synced_at   : timestamp saat berhasil sync
device_id   : identitas device pembuat record (audit trail)
```

---

## 7. AI Cache / Local Rules Engine

**Prinsip:** inferensi berat dilakukan di server secara periodik; client hanya mengevaluasi rule ringan yang sudah di-cache.

```
Server (Laravel + AI Endpoint)
  → Jalankan analitik/model terhadap data agregat (periodik: harian/mingguan)
  → Hasilkan rule set versi baru dalam format JSON, contoh:
      { "rule_id": "low_margin_alert",
        "condition": "margin < 10%",
        "action": "suggest_price_review",
        "version": 14 }
  → Push/pull rule set ke client saat online (bagian dari batch sync)

Client (Dexie + AI Cache)
  → Simpan rule set terbaru secara lokal
  → Local Rule Engine mengevaluasi rule terhadap data transaksi lokal
    secara real-time, tanpa internet
  → Log penggunaan rule disimpan lokal, ikut sync sebagai feedback loop
    untuk memperbaiki akurasi rule versi berikutnya
```

**Trade-off yang diakui secara terbuka:** rule di-cache tidak real-time — ada lag (mis. update mingguan) antara kondisi pasar aktual dan rekomendasi lokal. Ini menjadi bagian dari roadmap perbaikan (sinkronisasi rule lebih sering bila bandwidth memungkinkan).

---

## 8. Dashboard Bertingkat

| Level Pengguna                  | Kebutuhan Visibilitas                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Anggota Koperasi                | Riwayat transaksi pribadi, saldo simpanan, jadwal angsuran                                                                                             |
| Pengurus Koperasi               | Kondisi operasional harian (POS, stok, simpan pinjam) di unitnya, status profil/legalitas & permohonan pembiayaan                                      |
| Business Assistant (BA)         | Monitoring & pendampingan beberapa koperasi, resolusi konflik data, verifikasi approval, status kelengkapan dokumen legal                              |
| Project Management Office (PMO) | Agregasi lintas-koperasi, kesehatan sistem, tren performa wilayah, progres migrasi dari SIMKOPDES                                                      |
| Dinas/Kementerian               | Data koperasi terverifikasi (NIK, NPAK, pajak, lahan), status legalitas & kepatuhan pelaporan, setara/menggantikan fungsi dashboard nasional SIMKOPDES |

---

## 9. Kesesuaian dengan Tema Kompetisi

### Tema 1 — Peningkatan Usaha Koperasi Melalui Teknologi Digital

| Challenge Question                         | Status                    | Keterangan                                                                                   |
| ------------------------------------------ | ------------------------- | -------------------------------------------------------------------------------------------- |
| Identifikasi potensi ekonomi belum optimal | Kuat                      | Data transaksi/stok/produksi real-time (walau offline) jadi basis analitik performa koperasi |
| Efisiensi operasional & produktivitas      | Kuat (core value)         | Offline-first menghilangkan bottleneck pencatatan manual/Excel                               |
| Cocokkan potensi desa dengan pasar         | Gap — direncanakan fase 2 | Perlu modul Business Matching di atas data sikopet                                           |
| Pertemukan koperasi dengan buyer/offtaker  | Gap — direncanakan fase 2 | Sama seperti di atas                                                                         |
| Nilai tambah produk desa                   | Parsial                   | Data biaya & histori jual jadi basis rekomendasi AI                                          |

### Tema 2 — Optimalisasi Potensi Desa Melalui Koperasi

| Challenge Question                        | Status  | Keterangan                                                                                               |
| ----------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| Identifikasi potensi ekonomi tersembunyi  | Parsial | Data agregat lintas-koperasi via dashboard PMO berpotensi mengungkap pola, perlu layer analitik tambahan |
| Cocokkan potensi desa dengan pasar        | Gap     | Belum dalam scope saat ini                                                                               |
| Pertemukan koperasi dengan buyer/offtaker | Gap     | Belum dalam scope saat ini                                                                               |
| Nilai tambah produk lokal                 | Parsial | Sama seperti Tema 1                                                                                      |

**Posisi strategis:** sikopet adalah **fondasi data (data layer)** yang menjadi prasyarat sebelum fitur matching/AI recommendation lintas-desa bisa akurat — tanpa data transaksi, stok, dan produksi yang bersih dan real-time, sistem matching buyer-desa akan bekerja di atas data yang buruk.

**Diferensiasi terhadap SIMKOPDES (sistem yang digantikan):** SIMKOPDES saat ini sudah diadopsi 92,69% Koperasi Merah Putih namun sepenuhnya cloud/web-based, sehingga gagal optimal di area blankspot — sebagaimana terjadi di Jawa Timur, di mana 216 dari 8.494 KDMP berada di area blankspot dan baru 10 koperasi yang berhasil memperbarui data microsite akibat keterbatasan jaringan dan SDM. sikopet dirancang menggantikan SIMKOPDES dengan mempertahankan seluruh cakupan fungsinya (Bagian 5.5) sekaligus menambahkan kemampuan offline-first dan modul operasional yang lebih dalam (POS, gudang, logistik) yang belum tercakup pada menu SIMKOPDES saat ini.

---

## 10. Roadmap

| Fase                             | Cakupan                                                                                                                                                                                                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fase 1 (MVP — kompetisi)**     | 5 modul inti (Toko Sembako, Simpan Pinjam, Gudang, Logistik, Legalitas/Profil/Integrasi Pemerintah), Sync Engine, AI Cache/Local Rules, Dashboard bertingkat                                                                                                                                   |
| **Fase 2 — Migrasi & Integrasi** | Migrasi data dari SIMKOPDES eksisting (import profil, dokumen, anggota, data legalitas via API/export resmi Kemenkop), integrasi teknis ke Dukcapil/Kemenkumham-AHU/DJP/Agrinas/Bank Himbara, masa transisi paralel-run agar koperasi tidak kehilangan akses program pemerintah selama migrasi |
| **Fase 3**                       | AI Business Recommendation Engine, Business Matching Module (buyer/offtaker)                                                                                                                                                                                                                   |
| **Fase 4**                       | Village Potential Aggregator (agregasi nasional lintas-KDKMP)                                                                                                                                                                                                                                  |
| **Fase 5**                       | Integrasi pembayaran digital, live GPS tracking (jika infrastruktur memungkinkan)                                                                                                                                                                                                              |

**Catatan strategi migrasi:** karena SIMKOPDES sudah menjadi mandat wajib (Inpres No. 9 Tahun 2025 & Inpres No. 17 Tahun 2025) dengan basis pengguna besar, migrasi sikopet perlu pendekatan bertahap: (1) impor data eksisting via API/ekspor resmi, bukan re-entry manual; (2) periode paralel-run di mana koperasi tetap terverifikasi di kedua sistem; (3) mendapatkan dukungan/persetujuan resmi Kemenkop sebagai prasyarat legalitas penggantian sistem nasional.

---

## 11. Risiko & Mitigasi

| Risiko                                                                                                                         | Dampak                                                      | Mitigasi                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Data drift lama tidak tersinkron (device offline berkepanjangan)                                                               | Saldo/stok tidak akurat di server                           | Stok opname & mekanisme koreksi resmi; monitoring `sync_status: pending` di dashboard PMO                             |
| Duplikasi transaksi akibat retry sync                                                                                          | Data ganda                                                  | Idempotency key wajib di setiap operasi sync                                                                          |
| Fraud pada approval pinjaman besar dilakukan sepihak offline                                                                   | Kerugian finansial                                          | Status "pending approval" tidak final tanpa sinkronisasi & persetujuan BA                                             |
| Foto/lampiran besar memblokir sync data transaksi                                                                              | Delay data kritis                                           | Antrian upload terpisah untuk file berat                                                                              |
| Rekomendasi AI usang (rule cache lama)                                                                                         | Keputusan bisnis kurang tepat                               | Tampilkan versi & tanggal rule set di UI; sync rule lebih sering saat online                                          |
| Migrasi 92,69% akun eksisting dari SIMKOPDES gagal/kehilangan histori data                                                     | Koperasi kehilangan status verifikasi atau akses pembiayaan | Impor data via API/ekspor resmi, periode paralel-run, validasi data pasca-migrasi sebelum cutover                     |
| Ketergantungan pada API pemerintah eksternal (Dukcapil, Kemenkumham/AHU, DJP, Agrinas, Bank Himbara) yang berubah/tidak stabil | Verifikasi legalitas & permohonan pembiayaan tertunda       | Antrian retry untuk panggilan API eksternal; status "pending verifikasi" yang jelas ke pengguna, bukan silent failure |
| Resistensi adopsi karena pengurus sudah terbiasa dengan SIMKOPDES                                                              | Migrasi lambat, dukungan lapangan menurun                   | Pelatihan/bimtek migrasi, UI yang familiar dengan alur SIMKOPDES, dukungan BA/PMO selama transisi                     |
| Belum ada persetujuan resmi Kemenkop untuk menggantikan sistem yang sudah menjadi mandat presiden (Inpres 9/2025, 17/2025)     | Risiko legalitas/legitimasi produk                          | Posisikan Fase 1 sebagai pilot/proof-of-concept di wilayah tertentu sebelum pengajuan adopsi nasional                 |

---

## 12. Lampiran — Ringkasan Pola Teknis

| Aspek                                               | Pendekatan                                                                                                                                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID record                                           | Client-generated UUID/ULID                                                                                                                                                                     |
| Data uang & stok                                    | Append-only ledger, saldo = agregasi                                                                                                                                                           |
| Data master                                         | Last-Write-Wins + version, field-level merge                                                                                                                                                   |
| Data butuh 1 pemenang pasti                         | Deteksi konflik → flag manual                                                                                                                                                                  |
| File berat                                          | Antrian upload terpisah                                                                                                                                                                        |
| Kecerdasan/rekomendasi                              | Precompute server-side, evaluasi ringan client-side (AI Cache)                                                                                                                                 |
| Verifikasi legalitas ke sistem pemerintah eksternal | Capture data/dokumen offline sebagai draft → panggilan API (Dukcapil/AHU/DJP/Agrinas) hanya saat online → status verifikasi eksplisit ("pending"/"terverifikasi"/"ditolak"), tidak silent-fail |
