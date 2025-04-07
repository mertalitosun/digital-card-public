# Dijital Kartvizit Projesi

Dijital kartvizit oluşturma ve paylaşma uygulaması. Bu proje, kişilerin kartvizit bilgilerini dijital ortamda oluşturup kolayca paylaşmalarına olanak sağlar.

## ⚙️ Kullanılan Teknolojiler

Proje aşağıdaki teknolojileri kullanmaktadır:

- **HTML** – İçeriği oluşturmak için  
- **CSS** & **Bootstrap** – Şık ve responsive arayüz için  
- **JavaScript** – Etkileşimli kullanıcı deneyimi için  
- **Node.js & Express.js** – Sunucu tarafı ve API işlemleri için  
- **MySQL** – Veritabanı işlemleri için (kullanıcı bilgileri, kartvizit içeriği vs.)

---

## 🚀 Kurulum

Proje bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

### 1. Projeyi Klonla

```bash
git clone https://github.com/mertalitosun/digital-card-public.git
cd digital-card-public
```

### 2. Gerekli Bağımlılıkları Yükle

```bash
npm install
```

### 3. Veritabanı Ayarları

```bash
DB_HOST = localhost
DB_USER = root
DB_PASS = yourDatabasePassword
DB = yourDatabase
```

### 4. .env Ayarları (Mail ve JWT)

```bash
SMTP_PORT = 465
SMTP_HOST = ******

SMTP_INFO_USER = yourMailAddress@example.com
SMTP_INFO_PASS = yourPassword

SMTP_SUPPORT_USER = yourMailAddress@example.com
SMTP_SUPPORT_PASS = yourPassword

JWT_SECRET = infinitetag2024jwttoken
```

### 5. Uygulamayı Başlat
```bash
npm start
```