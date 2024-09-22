
<div align="center"">
    <img style="margin: auto;" src="./assets/nodedotjs.svg" alt="nodejs" width="48">
</div>

<h1 align="center"">API RESTful</h1>

<p>Construida em cima da arquitetura "Model View Controller. Robusta e escalável, suporta todas as operações cruds. Parte de autenticação feita com JWT. Middlewares de segurança. Jobs de agendamento"</p>

<h2>Regras de negócio</h2>

- Todos os usuários podem criar tasks para o setor de T.i
- Tasks são feitas por ordem de data e hora.

<h2>Requisitos funcionais</h2>

- Um usuário pode criar tasks
- Um usuário pode responder tasks
- Um usuário pode atualizar tasks para fazer, fazendo, feito
- Um usuário pode vizualizar todas as tasks
- Um usuário pode vizualizar uma tasks especifica
- Um usuário pode filtrar tasks por status, title, data
- Um usuário pode criar documentações
- Um usuário pode vizualizar uma documentação
- Um usuário pode pesquisar documentação por title
- Um usuário pode agendar reuniões
- Um usuário pode filtrar reuniões por todas, pendentes, feitas
- O job deve rodar todas as manhãs as 8h para ver se existe algum agendamento na data atual, se existir, ele deve disparar um email avisando o usuário

<h2>Requisitos não funcionais</h2>

- A aplicação deve ser fácil de usar
- A aplicação deve suportar usuários simultaneos
- A aplicação deve ser fácil de realizar manutenções no código e implementações de features novas
- A aplicação deve ser segura

<h2>Tecnologias</h2>

- <a style="color: #5FA04E;" href="https://nodejs.org/en" target="_blank">Nodejs</a> 
- <a style="color: black;" href="https://expressjs.com/pt-br/" target="_blank">Express.js</a>
- <a href="https://knexjs.org/guide/query-builder.html#select" style="color: orange;" target="_blank">Knex.js</a>  
- <a href="https://www.sqlite.org/" style="color: cadetblue;" target="_blank">Sqlite</a> - Obs: por ser construido com Knex, a aplicação suporta diversos bancos de dados. <a style="color: orange;" href="https://knexjs.org/guide/" target="_blank">documentação  Knex.js</a>
- <a href="https://jwt.io/" target="_blank">JWT</a>
- [Clique aqui para ver mais](https://github.com/FelipePinheiroRegina/backend-titasks/blob/main/package.json)


<h2>Rotas da aplicação</h2>

<ul>
    <strong>endpoints</strong>
    <li>/users</li>
    <li>/sessions</li>
    <li>/tasks</li>
    <li>/answer</li>
    <li>/documentations</li>
    <li>/steps</li>
    <li>/schedules</li>
</ul>

<h2>Como rodar a aplicação</h2>

```
// bash
cd ~

mkdir projects

git clone https://github.com/FelipePinheiroRegina/backend-titasks.git

cd backend-titasks

npm install 

-----------------------------
touch .env

nano .env 

// coloque as variaveis de ambiente
AUTH_SECRET
PORT

EMAIL_USER
EMAIL_PASS

ctrl + o + enter
ctrl + x

// ou se preferir faça abrindo o vscode

code .
---------------------------------

npm run dev // development

npm start // production
```

<h2>Desenvolvedor</h2>

<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
    <img style="border-radius: 50%;" src="./assets/feGreen.jpeg" alt="Minha imagem" width="48">
    <strong>Felipe Pinheiro Regina</strong>
</div>

<div style="display: flex; align-items: center; gap: 8px;">
    <img src="./assets/social_15707753.png" alt="linkedin" width="48">
    <a href="https://www.linkedin.com/in/felipe-pinheiro-002427250/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
</div>




