# راهنمای تنظیم GitHub Repository

## 📋 مراحل ایجاد Repository در GitHub:

### 1. **ورود به GitHub:**
- به آدرس `https://github.com` بروید
- با ایمیل `mirosapen@gmail.com` وارد شوید

### 2. **ایجاد Repository جدید:**
- روی دکمه **"New"** یا **"+"** کلیک کنید
- **Repository name**: `hesa-leave-manager`
- **Description**: `سیستم مدیریت مرخصی حسا - Leave Management System`
- **Visibility**: `Public` یا `Private` (انتخاب شما)
- **Initialize**: تیک **"Add a README file"** را بردارید
- روی **"Create repository"** کلیک کنید

### 3. **کپی کردن URL:**
بعد از ایجاد repository، URL آن را کپی کنید:
```
https://github.com/mirosapen/hesa-leave-manager.git
```

### 4. **اضافه کردن Remote:**
```bash
git remote add origin https://github.com/mirosapen/hesa-leave-manager.git
```

### 5. **Push کردن پروژه:**
```bash
git push -u origin main
```

## 🔑 **تنظیمات Authentication:**

### **روش 1: Personal Access Token**
1. به `Settings` > `Developer settings` > `Personal access tokens` بروید
2. روی **"Generate new token"** کلیک کنید
3. **Scopes** را انتخاب کنید: `repo`, `workflow`
4. Token را کپی و ذخیره کنید
5. هنگام push، از token به عنوان password استفاده کنید

### **روش 2: SSH Key**
1. SSH key ایجاد کنید
2. آن را به GitHub اضافه کنید
3. از SSH URL استفاده کنید

## 📝 **دستورات کامل:**

```bash
# اضافه کردن remote
git remote add origin https://github.com/mirosapen/hesa-leave-manager.git

# Push کردن
git push -u origin main

# بررسی وضعیت
git status
git log --oneline -3
```

## ⚠️ **نکات مهم:**

1. **Repository name**: باید منحصر به فرد باشد
2. **Authentication**: حتماً authentication را تنظیم کنید
3. **Branch**: از `main` branch استفاده می‌کنیم
4. **README**: فایل README.md موجود است

## 🎯 **نتیجه:**

بعد از انجام این مراحل، پروژه شما در GitHub قرار خواهد گرفت و قابل دسترسی خواهد بود.
