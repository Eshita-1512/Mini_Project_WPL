# Mini_Project_WPL

## 🛒 E-Commerce Platform

A full-stack e-commerce application that enables users to browse products, manage a shopping cart, and complete secure payments. The system includes authentication, product management, and integrated payment processing.

---

## 🚀 Features

* **User Authentication** – Secure sign-up and login with session/JWT-based handling
* **Product Management** – Add, update, and delete products (admin functionality)
* **Shopping Cart** – Add, remove, and manage product quantities
* **Secure Payments** – Integrated Razorpay checkout for order processing
* **Responsive UI** – Mobile-first interface built using Tailwind CSS

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios
* React Context API

### Backend

* Flask (Python)
* PostgreSQL (Neon DB)
* SQLAlchemy
* JWT / Session-based Authentication
* Razorpay SDK

---

## ⚙️ Setup & Installation

### Backend

```bash id="b1"
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

---

### Frontend

```bash id="b2"
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

* Frontend is configured for deployment on Vercel (includes routing support)
* Backend can be deployed on platforms like Render
* Ensure API endpoints are updated after deployment

---

## ⚠️ Important Notes

* Do not commit `.env` files (contains sensitive credentials)
* Store API keys (Razorpay, database) securely
* Ensure backend is running before accessing frontend features

---

## 📈 Future Improvements

* Order history and tracking
* Enhanced UI/UX and animations
* Admin dashboard with analytics

---

## 👩‍💻 Author

Mini Project – Web Programming Lab
