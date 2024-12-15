// Event listener untuk tombol Send
document.getElementById("btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Menampilkan SweetAlert setelah tombol diklik
    Swal.fire({
        title: "Terima kasih!",
        text: "Pesan Anda telah terkirim.",
        imageUrl: "https://unsplash.it/400/200",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Pesan Terkirim"
    });
    
    // Anda dapat menambahkan kode untuk mengirim data form ke server jika diperlukan di sini
});
