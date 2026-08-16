// Webpack akan mencarinya di folder dist/images/ saat dijalankan
const imgHtml = `<img src="/images/register-illustration.png" alt="Register Illustration">`;

export function registerView() {
    return `
    <div class="auth-layout">
        <article class="auth-card">
            <aside class="auth-card__illustration">
                <img src="/images/register-illustration.png" alt="Ilustrasi Daftar">
            </aside>

            <section class="auth-card__content">
                <h1 class="auth-title">Daftar</h1>
                <form class="auth-form" id="registerForm">
                    <div class="form-group">
                        <label class="form-label">Nama Pengguna</label>
                        <input type="text" id="username" class="form-input" placeholder="Masukkan nama anda" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="email" class="form-input" placeholder="Masukkan email anda" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kata Sandi</label>
                        <input type="password" id="password" class="form-input" placeholder="Password" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Konfirmasi Kata sandi</label>
                        <input type="password" id="confirm-password" class="form-input" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn--primary btn--full">Masuk</button>
                    <a href="/login" class="btn btn--outline btn--full" data-link>Sudah punya akun ?</a>
                </form>
            </section>
        </article>
    </div>
    `;
}