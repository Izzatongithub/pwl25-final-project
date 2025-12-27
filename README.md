# Final Proyek Mata Kuliah Pemrograman Web Lanjut

Judul: Sistem Booking Lapangan (BookMyField), Sistem ini memungkinkan user untuk melihat lapangan, memilih slot waktu, melakukan booking, dan melihat riwayat booking. Admin dapat menambahkan/edit/hapus lapangan dan slot waktu, serta mengubah status booking.

- Mba Aqila
- Izzat
- Wahyu

### Struktur Folder
1. Backend

2. Frontend


### Menjalankan Backend
1. Masuk ke folder `backend` dengan:
   
   `cd backend`
   
3. Install dependencies/environment:
   
   `npm install`
   
5. Buat file `.env`:
   
    `PORT=3000`
    `DB_HOST=localhost`
    `DB_USER=root`
    `DB_PASSWORD=yourpassword`
    `DB_NAME=booking_db`
    `JWT_SECRET=secretkey`
  
7. Jalankan server dengan `npm run dev` apabila sudah install `nodemon`
    Server akan berjalan di: http://localhost:3000

### Menjalankan Frontend
1. Masuk ke folder `frontend` dengan:

    `cd frontend`

2. Install dependencies/Environment:

    `npm install`

3. Jalankan frontend dengan `npm run dev`
    Frontend akan berjalan di: http://localhost:5173 (atau port yang diberikan Vite)


### Daftar Endpoint


1. `app.use('/api/auth', authRoutes)` dengan endpoint:
    - `router.post('/register', validate(['username', 'password']), register)`
    URL: http://localhost:3000/api/auth/register
    Digunakan saat melakukan registrasi user baru

    - `router.post('/login', validate(['username', 'password']), login)`
    URL: http://localhost:3000/api/auth/register
    Digunakan saat user melakukan login


2. `app.use('/api/fields', fieldRoutes)` dengan endpoint:

    - `router.get('/', getFields)`
    URL: http://localhost:3000/api/fields
    Digunakan saat ambil semua field/lapangan

    - `router.post('/', verifyToken, validate(['name', 'type', 'deskripsi']), isAdmin, addField)`
    URL: http://localhost:3000/api/fields
    Digunakan saat admin menambahkan field/lapangan baru

    - `router.put('/:id', verifyToken, isAdmin, updateField)`
    URL: http://localhost:3000/api/fields/{id}
    Digunakan saat admin edit data field/lapangan

    - `router.delete('/:id', verifyToken, isAdmin, deleteField)`
    URL: http://localhost:3000/api/fields/{id}
    Digunakan saat admin menghapus field/lapangan

3. `app.use('/api/bookings', bookingRoutes)` dengan endpoint:

    - `router.get('/', verifyToken, getBookings)`
    URL: http://localhost:3000/api/bookings
    Digunakan saat melihat daftar booking

    - `router.post('/', verifyToken, validate(['field_id', 'booking_date', 'time_slot_id']), createBooking)`
    URL: http://localhost:3000/api/bookings
    Digunakan saat user melakukan booking

    - `router.put('/:id/status', verifyToken, isAdmin, updateBookingStatus)`
    URL: http://localhost:3000/api/bookings/:id/status
    Digunakan saat admin mengubah status booking pengguna

    - `router.get('/fields', verifyToken, getFields)`
    URL: http://localhost:3000/api/bookings/fields
    Digunakan saat user melihat lapangan pada form booking

    - `router.get('/time-slots', verifyToken, getTimeSlots)`
    URL: http://localhost:3000/api/bookings/time-slots
    Digunakan saat user memilih jam booking yang tersedia di form booking

    - `router.get('/user', verifyToken, getUserBooking)`
    URL: http://localhost:3000/api/bookings/user
    Digunakan saat admin melihat daftar user yang telah melakukan booking

    - `router.put('/:id/complete', verifyToken, isAdmin, completeBooking)`
    URL: http://localhost:3000/api/bookings/:id/complete
    Digunakan saat admin mengubah status booking menjadi `selesai`

4. `app.use('/api/time-slots', timeSlotRoutes)` dengan endpoint:

    - `router.get('/', verifyToken, getTimeSlots)`
    URL: http://localhost:3000/api/time-slots
    Digunakan saat menampilkan daftar jam lapangan

    - `router.post('/', verifyToken, isAdmin, addTimeSlot)`
    URL: http://localhost:3000/api/time-slots
    Digunakan saat admin menambah jam booking lapangan

    - `router.put('/:id', verifyToken, isAdmin, updateTimeSlot)`
    URL: http://localhost:3000/api/time-slots/:id
    Digunakan saat admin ingin mengubah data pada tabel time_slots

    - `router.delete('/:id', verifyToken, isAdmin, deleteTimeSlot)`
    URL: http://localhost:3000/api/time-slots/:id
    Digunakan saat admin ingin menghapus data jam lapangan