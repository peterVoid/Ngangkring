# 🥢 Angkringan – Aplikasi Pemesanan Warkop Digital

Angkringan adalah aplikasi web **pemesanan makanan & minuman** untuk warung kopi (warkop) modern. Pengunjung cukup **scan QR code** untuk langsung mengakses menu, memesan, dan melacak status pesanan **tanpa harus login**.

✨ Dibuat dengan teknologi modern seperti **Next.js 15**, **Supabase Realtime**, **Drizzle ORM**, dan **Clerk** untuk kebutuhan admin.

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, Shadcn UI, React Hook Form
- **Backend:** Supabase Realtime, Drizzle ORM, Neon DB
- **Auth:** Clerk (untuk admin)
- **Others:** React Query, UploadThing, Recharts, Zod

---

## 📱 Alur Pengguna (Customer Flow)

1. ✅ **Scan QR Code** → langsung masuk ke halaman menu.
2. 📂 **Menu bisa difilter** berdasarkan kategori seperti _makanan_ atau _minuman_.
3. 🛒 **Tambah ke keranjang** tanpa login.
4. ✍️ **Masukkan nomor meja** di halaman keranjang.
5. ➖➕ **Atur kuantitas**, **hapus item**, atau **clear keranjang**.
6. 📦 **Klik “Pesan”**, lalu data akan masuk ke sistem backend.
7. 📜 **Cek riwayat pesanan (order history)** untuk melacak status pesanan secara real-time.

---

## 🛠 Alur Admin

1. 🔐 **Login menggunakan Clerk** untuk akses fitur admin.
2. 🗂️ **Kelola kategori dan produk** – Tambah, ubah, atau hapus makanan/minuman.
3. 📦 **Kelola pesanan pelanggan** – Pantau dan ubah status pesanan secara **real-time** dengan Supabase Realtime (misalnya: "pending", "diterima", "diproses").
4. 🧑‍💼 **Kelola request admin baru** – Teman yang ingin jadi admin bisa mengakses halaman khusus dan memasukkan **password rahasia**.
5. ✅ **Setujui permintaan admin** – Setelah request dikirim, admin utama bisa mempromosikannya dari halaman _Request Admin_.

## ✨ Fitur Unggulan

- ✅ **Tanpa login untuk pelanggan**
- 📱 **Responsif dan mobile-friendly**
- 🧾 **Tracking pesanan per meja**
- 📊 **Dashboard admin real-time**
- 🔄 **Realtime order status updates**
- ⚙️ **Role-based access untuk admin**
- 🔐 **Proteksi akses admin via password**
