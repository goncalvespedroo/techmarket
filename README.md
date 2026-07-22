#  Techmart API

> Teste Técnico Backend para a **Nex**

Uma API RESTful escalável e resiliente para gerenciamento de estoque, autenticação de usuários/vendedores e processamento **atômico de pedidos**.

O principal objetivo desta solução é garantir a **integridade dos dados em cenários de concorrência**, evitando inconsistências durante o checkout através de transações ACID do Prisma.

---

##  Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| **Node.js + NestJS** | Framework Backend |
| **TypeScript** | Tipagem estática |
| **Prisma ORM** | ORM e transações |
| **PostgreSQL (Neon)** | Banco de dados relacional |
| **JWT** | Autenticação |
| **Bcrypt** | Hash de senhas |

---

#  Arquitetura

A aplicação segue a arquitetura padrão do NestJS:

```
src/
├── auth/
├── users/
├── products/
├── orders/
├── prisma/
├── common/
└── main.ts
```

Cada módulo é responsável por seu domínio, contendo:

- Controllers
- Services
- DTOs
- Guards
- Entities

Essa separação facilita manutenção, testes e escalabilidade.

---

#  Autenticação

A autenticação utiliza:

- JWT
- Bcrypt
- Auth Guards do NestJS

Fluxo:

```
Register
      ↓
 Hash da senha
      ↓
 Login
      ↓
 JWT
      ↓
 Rotas protegidas
```

---

#  Regra de Negócio Principal

## Checkout Atômico

Todo processamento de pedidos ocorre dentro de uma transação do Prisma.

```ts
await this.prisma.$transaction(async (tx) => {
    // valida estoque
    // atualiza produtos
    // cria pedido
    // cria itens
});
```

Fluxo da transação:

1. Validação do estoque
2. Cálculo dos subtotais
3. Atualização do estoque
4. Atualização do status do produto
5. Criação do pedido
6. Criação dos itens

## Rollback Automático

Caso qualquer etapa falhe:

- estoque insuficiente;
- erro de conexão;
- erro inesperado.

Toda a transação é revertida automaticamente.

Isso impede:

- venda sem estoque;
- pedidos órfãos;
- inconsistência entre produtos e pedidos.

---

# 🧪 Testes

Foi desenvolvido um script em **Fish Shell** para validar todo o fluxo da aplicação.

Fluxo testado:

```
Registro
      ↓
Login
      ↓
Criação de Produto
      ↓
Checkout
      ↓
Validação do Estoque
```

Execução:

```bash
chmod +x test_flow.fish
./test_flow.fish
```

---

#  Executando o Projeto

## Clone

```bash
git clone https://github.com/seu-usuario/techmarket.git
```

```bash
cd techmarket
```

---

## Variáveis de Ambiente

Crie um arquivo `.env`

```env
DATABASE_URL=

JWT_SECRET=

JWT_EXPIRES_IN=
```

---

## Instale as dependências

```bash
npm install
```

---

## Gere o Prisma Client

```bash
npx prisma generate
```

---

## Execute as migrations

```bash
npx prisma migrate deploy
```

---

## Inicie a aplicação

```bash
npm run start:dev
```

---

#  Diferenciais da Implementação

- ✅ Arquitetura modular com NestJS
- ✅ ORM fortemente tipado
- ✅ PostgreSQL Serverless (Neon)
- ✅ Autenticação JWT
- ✅ Senhas protegidas com Bcrypt
- ✅ Processamento de pedidos atômico
- ✅ Rollback automático
- ✅ Script E2E via terminal

---

#  Fluxo do Pedido

```text
Cliente
    │
    ▼
POST /orders
    │
    ▼
Validação do Estoque
    │
    ▼
Prisma Transaction
    │
    ├── Atualiza estoque
    ├── Atualiza produto
    ├── Cria pedido
    └── Cria OrderItems
    │
    ▼
Commit
    │
    ▼
Resposta 201
```

---

#  Autor

**Pedro Gonçalves**

Backend Engineer • Node.js • NestJS • PostgreSQL • Prisma
