# 🐾 Clínica Veterinária - Sistema de Gestão

Um sistema web completo para gestão de clínicas, veterinários e atendimentos, desenvolvido com **Next.js** no front-end e **Spring Boot (Java)** no back-end.

---

## 🚀 Tecnologias Utilizadas

### **Front-end**
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (Tema Dark Purple & Emerald)
- **Deploy:** Vercel

### **Back-end**
- **Framework:** Spring Boot 3
- **Linguagem:** Java 21+
- **ORM / Banco:** Spring Data JPA / Hibernate (MySQL / Aiven)
- **Deploy:** Render

---

## 🛠️ Arquitetura do Projeto

```text
clinica-veterinaria/
├── frontend/             # Aplicação Next.js (Interface do Usuário)
│   ├── src/
│   │   ├── app/          # Páginas e rotas da aplicação
│   │   └── services/     # Consumo da API REST
│   └── package.json
│
└── backend/              # API REST em Spring Boot
    ├── src/
    │   └── main/java/com/example/clinica/
    │       ├── controller/   # Endpoints da API
    │       ├── model/        # Entidades JPA
    │       ├── repository/   # Interfaces Spring Data JPA
    │       └── service/      # Regras de negócio
    └── pom.xml