// Kullanıcı Adı (Slug) Kontrolü
async function checkSlugAvailability() {
    const slug = document.getElementById('slug').value;
    const errorElement = document.getElementById('slugError');
    if (slug.length > 0) {
        const response = await fetch(`/dashboard/check-slug/${slug}`);
        const data = await response.json();
        if (data.isAvailable) {
            errorElement.style.display = 'none';
        } else {
            errorElement.style.display = 'block';
        }
    }
}