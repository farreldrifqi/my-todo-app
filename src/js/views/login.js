// src/js/views/login.js
const imgHtml = `<img src="/images/login-illustration.png" alt="Login Illustration">`;

export function loginView() {
    return `
    <div class="auth-layout">
        <article class="auth-card">
            <section class="auth-card__content">
                <h1 class="auth-title">Masuk</h1>
                <form class="auth-form" id="loginForm">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="email" class="form-input" placeholder="Masukkan email anda" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kata Sandi</label>
                        <input type="password" id="password" class="form-input" placeholder="Password" required>
                    </div>
                    
                    <button type="submit" class="btn btn--primary btn--full">Masuk</button>
                    <a href="/register" class="btn btn--outline btn--full" data-link>Buat akun baru</a>
                </form>
            </section>
            <aside class="auth-card__illustration">
                <img src="/images/login-illustration.png" alt="Ilustrasi Login">
            </aside>
        </article>
    </div>
    `;
}