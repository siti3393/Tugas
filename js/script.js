// Proteksi Halaman
document.addEventListener("DOMContentLoaded", function () {
  const user = sessionStorage.getItem("loggedUser");
  const currentPage = window.location.pathname.split("/").pop();

  // Proteksi halaman
  const protectPage = ["dashboard.html", "stok.html", "tracking.html"];

  // Kalau BELUM login & buka halaman protected → balik ke login
  if (!user && protectPage.includes(currentPage)) {
    window.location.href = "index.html";
  }

  // Kalau SUDAH login & masih di login page → ke dashboard
  if (user && currentPage === "index.html") {
    window.location.href = "dashboard.html";
  }
});

// ==== LOGIN HANDLER ====

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = dataPengguna.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      sessionStorage.setItem("loggedUser", JSON.stringify(user));
      const btnModal = document.getElementById("modalOk");
      btnModal.textContent = "Lanjutkan";
      showModal({
        title: "Login Berhasil ✅",
        description: `${user.nama}`,
        onOk: () => (window.location.href = "dashboard.html"),
      });
    } else {
      const btnModal = document.getElementById("modalOk");
      btnModal.textContent = "Ok";
      showModal({
        title: "Peringatan!!",
        description: "Email atau password salah",
      });
    }
  });
}

// ===== DASHBOARD LOGIC =====
document.addEventListener("DOMContentLoaded", () => {
  const userData = sessionStorage.getItem("loggedUser");
  const greeting = document.getElementById("greeting");
  const logoutBtn = document.getElementById("logoutBtn");

  // kalau bukan di dashboard, abaikan
  if (!greeting) return;

  const user = JSON.parse(userData);

  // greeting otomatis berdasarkan waktu
  const hour = new Date().getHours();
  let greetText = "";

  if (hour >= 5 && hour < 10) greetText = "Selamat Pagi";
  else if (hour >= 11 && hour < 14) greetText = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greetText = "Selamat Sore";
  else greetText = "Selamat Malam";

  greeting.textContent = `${greetText}, ${user.nama} (${user.role})`;
});

// fungsi navigasi
function navigateTo(page) {
  window.location.href = page;
}

// ===== TRACKING LOGIC =====
function cariDO() {
  const input = document.getElementById("inputDO").value.trim();
  const container = document.getElementById("trackingResult");

  if (!input) {
    showModal({
      title: "Peringatan!",
      description: "Nomor DO belum di isi",
      onOk: () => {},
    });
    return;
  }

  const data = dataTracking[input];

  if (!data) {
    showModal({
      title: "Peringatan!",
      description: "Nomor DO tidak ditemukan",
      onOk: () => {},
    });
    return;
  }

  let perjalananHTML = "";
  data.perjalanan.forEach((p) => {
    perjalananHTML += `
      <div class="perjalanan-item">
        <strong>${p.waktu}</strong><br />
        ${p.keterangan}
      </div>
    `;
  });

  container.innerHTML = `
    <h3>Detail Pengiriman</h3>
    <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
    <p><strong>Nama:</strong> ${data.nama}</p>
    <p><strong>Status:</strong> ${data.status}</p>
    <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
    <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
    <p><strong>Total Pembayaran:</strong> ${data.total}</p>
    <h4>Riwayat Perjalanan:</h4>
    ${perjalananHTML}
  `;
}

// ==== STOCK LOGIC ====
function tampilkanStok() {
  const tabelBody = document.getElementById("tabelBody");
  if (!tabelBody) return;

  tabelBody.innerHTML = "";
  dataBahanAjar.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.kodeLokasi}</td>
      <td>${item.kodeBarang}</td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>${item.edisi}</td>
      <td>${item.stok}</td>
      <td><img src="${item.cover}" alt="${item.namaBarang}" /></td>
    `;
    tabelBody.appendChild(row);
  });
}

window.onload = function () {
  if (document.getElementById("tabelBody")) {
    tampilkanStok();
  }
};

// === Menampilkan data stok ===
function tampilkanStok() {
  const tabelBody = document.getElementById("tabelBody");
  if (!tabelBody) return;

  tabelBody.innerHTML = "";
  dataBahanAjar.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.kodeLokasi}</td>
      <td>${item.kodeBarang}</td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>${item.edisi}</td>
      <td>${item.stok}</td>
      <td><img src="${item.cover}" alt="${item.namaBarang}" /></td>
    `;
    tabelBody.appendChild(row);
  });
}

// === Simpan Data Baru dari Form ===
function simpanData(event) {
  event.preventDefault();
  const modal = document.getElementById("customModal");
  const formTambah = document.getElementById("formTambah");
  const btnModalCancel = document.getElementById("modalCancel");
  const btnModalOk = document.getElementById("modalOk");

  const newData = {
    kodeLokasi: document.getElementById("kodeLokasi").value.trim(),
    kodeBarang: document.getElementById("kodeBarang").value.trim(),
    namaBarang: document.getElementById("namaBarang").value.trim(),
    jenisBarang: document.getElementById("jenisBarang").value.trim(),
    edisi: document.getElementById("edisi").value.trim(),
    stok: parseInt(document.getElementById("stok").value, 10),
    cover: "img/default.jpg",
  };

  if (
    !newData.kodeLokasi ||
    !newData.kodeBarang ||
    !newData.namaBarang ||
    isNaN(newData.stok)
  ) {
    alert("Lengkapi semua data dengan benar!");
    return;
  }

  dataBahanAjar.push(newData);
  tampilkanStok();
  formTambah.style.display = "none";
  showModal({
    title: "Sukses!!",
    description: "",
    onOk: () => {},
  });
  btnModalCancel.textContent = "Ok";
  document.getElementById("formTambah").reset();
}

function fiturBelum() {
  Swal.fire({
    title: "Fitur Belum Tersedia",
    text: "Menu ini masih dalam pengembangan 🚧",
    icon: "info",
    confirmButtonText: "OK",
  });
}

function showModal({
  title = "Title",
  description = "Deskripsi",
  onOk = null,
  onCancel = null,
}) {
  const modal = document.getElementById("customModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const btnOk = document.getElementById("modalOk");
  const btnCancel = document.getElementById("modalCancel");

  // set isi
  modalTitle.innerText = title;
  modalDesc.innerText = description;

  // tampilkan
  modal.classList.add("active");

  // reset event biar gak numpuk
  btnOk.onclick = null;
  btnCancel.onclick = null;

  // tombol OK
  btnOk.onclick = () => {
    modal.classList.remove("active");
    if (onOk) onOk();
  };

  // tombol Cancel
  btnCancel.onclick = () => {
    modal.classList.remove("active");
    if (onCancel) onCancel();
  };
}
