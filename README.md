<div align="center">
  <h1>Connections Website</h1>
  <p>O portal oficial e dashboard do Connections, o bot que une comunidades no Discord.</p>

  <p align="center">
    <br />
    <br />
    <img src="https://img.shields.io/github/stars/Spyei/connections-website?style=for-the-badge&color=5865F2" alt="Stars" />
    <img src="https://img.shields.io/github/forks/Spyei/connections-website?style=for-the-badge&color=5865F2" alt="Forks" />
    <img src="https://img.shields.io/github/license/Spyei/connections-website?style=for-the-badge&color=5865F2" alt="License" />
  </p>
</div>

---

## Sobre o Projeto

O Connections é um bot de Discord projetado para criar pontes entre servidores, permitindo chats globais e integração de comunidades. Este repositório contém o código-fonte do website, que serve como a página de apresentação do bot e uma dashboard para gerenciamento de configurações.

### Funcionalidades
- Landing Page Moderna: Design responsivo para novos usuários.
- Integração com Discord: Sistema de login via OAuth2.
- Dashboard: Interface para administradores gerenciarem suas instâncias.
- Status em Tempo Real: Monitoramento da saúde e estatísticas do bot.

---

## Stack Tecnológica

O projeto foi construído com as seguintes tecnologias:

- Next.js 14: Framework React com foco em performance e SEO.
- TypeScript: Garantia de segurança com tipagem estática.
- Tailwind CSS: Estilização utilitária e design responsivo.
- Hyper-express: API de alta performance.
- MongoDB: Banco de dados NoSQL para escalabilidade.
- Framer Motion: Animações na interface.

---

## Como Rodar o Projeto

Para configurar o ambiente de desenvolvimento localmente, siga estes passos:

### Pré-requisitos
- Node.js (v18+)
- NPM ou Yarn

### Instalação

1. Clone o repositório:
```bash
git clone [https://github.com/connectionsteam/website.git](https://github.com/connectionsteam/website.git)
cd website
```

2. Instale as dependências:

```bash
npm install
```


3. Variáveis de Ambiente:
Crie um arquivo .env na raiz e configure suas credenciais:
```env
DATABASE_URL=seu_mongodb_url
DISCORD_CLIENT_ID=id_do_bot
DISCORD_CLIENT_SECRET=secret_do_bot
NEXTAUTH_SECRET=sua_secret_aleatoria
```


4. Inicie o servidor de desenvolvimento:
```bash
npm run dev

```

Acesse http://localhost:3000 no seu navegador.

---

## Contribuição

1. Faça um Fork do projeto.
2. Crie sua Feature Branch (git checkout -b feature/NovaFeature).
3. Commit suas mudanças (git commit -m 'feat: Adiciona nova funcionalidade').
4. Push para a Branch (git push origin feature/NovaFeature).
5. Abra um Pull Request.

---

## Autor

Desenvolvido por Caio (Spyei) e a equipe do Connections Team.

---

<p align="center">Projeto sob a Licença MIT</p>
