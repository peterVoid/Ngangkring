# 🥢 Angkringan – Aplikasi Pemesanan Warkop Digital

**Angkringan** adalah aplikasi pemesanan makanan & minuman untuk warkop modern. Pengunjung cukup **scan QR Code** untuk langsung melihat menu, memesan, dan melacak status pesanan **tanpa harus login**.

✨ Dibangun dengan **Next.js 15**, **Supabase Realtime**, **Drizzle ORM**, dan **Clerk** untuk manajemen admin.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, Shadcn UI, React Hook Form
- **Backend:** Supabase Realtime, Drizzle ORM, Neon Database
- **Auth:** Clerk
- **Others:** React Query, UploadThing, Recharts, Zod, ShadCN, Lucide Icons

---

## 📲 Alur Pengguna (Tanpa Login)

1. 🔍 **Scan QR Code** di meja warkop.
2. 📋 **Lihat daftar menu** yang bisa difilter berdasarkan kategori (_makanan_, _minuman_, dll).
3. 🛒 **Tambah produk ke keranjang** tanpa login.
4. 🪑 **Masukkan nomor meja** di halaman cart.
5. ➕➖ **Atur jumlah**, hapus item, atau clear keranjang.
6. ✅ Klik **"Pesan"** untuk submit order.
7. 🔁 **Lacak status pesanan** secara real-time di halaman **Order History**.

---

## 🛠 Alur Admin (Dengan Login)

1. 🔐 **Login via Clerk** melalui halaman:
2. 🧾 **Kelola kategori dan produk** (Tambah/Ubah/Hapus).
3. 📦 **Kelola pesanan** pelanggan:

- Ubah status pesanan seperti: `pending`, `diterima`, `diproses`, `selesai`.
- Update status dilakukan secara **real-time** menggunakan **Supabase Realtime**.

4. 🧑‍💼 **Kelola request admin baru**:

- User yang ingin jadi admin bisa akses halaman:
  ```
  /request-admin
  ```
- Masukkan **password rahasia**, jika benar, akan disuruh login, permintaan akan muncul di dashboard admin.
- Admin utama bisa **promote** user tersebut menjadi admin.

---

## ✨ Fitur Unggulan

- ✅ **Tanpa login** untuk pelanggan
- 🧾 **Tracking pesanan** berdasarkan nomor meja
- ⚡ **Real-time order updates** untuk admin & user
- 🛠 **Dashboard admin lengkap** (produk, kategori, pesanan, admin)
- 🔐 **Proteksi halaman admin** via login dan request password
- 📱 **Mobile responsive** dan user-friendly UI
