node-api-cli
======

A Node Api CLI facilita a criação de uma aplicação que já funciona, com controle de sessῶao de usuário com JwT e registro de acessos e de CRUDs e usando o SendGrid como gerenciador de envio de email padrão. 

Atualmente com configuração de banco pronta somente para MongoDB através do Mongoose.

Já segue as melhores práticas de API em Node Js!

Este facilitador conta com uma extensão para o [VS Code](https://code.visualstudio.com/) de nome [Snippets node-api-cli](https://marketplace.visualstudio.com/items?itemName=snippets-node-api-cli.snippets-node-api-cli), para auxiliar ainda mais na manutenção de sua aplicação.

Instalação
------------
1. Abra o terminal e aponte para a pasta destino do projeto;
2. Execute no terminal:
```bash
npm install -g yo generator-node-api-cli
```
3. E com isso o node-api-cli estará disponível para uso  executando:
```bash
yo node-api-cli
```

Opções disponíveis
------------

Ao executar o comando inicial "yo node-api-cli" poderá escolher uma das opções abaixo: 

- `Criar novo projeto API com MongoDB`: que cria uma estrutura padrão de projeto API em NodeJs utilizando o MongoDB;
- `Criar nova Entidade com MongoDB`: que cria um modelo, controle, repositório e rota padrão da entidade utilizando o MongoDB;
- `Criar nova Rota`: que cria uma rota padrão de projeto API em NodeJs;
- `Criar novo Controle`: que cria um controle padrão de projeto API em NodeJs;
- `Criar novo Repositório com Mongoose`: que cria um repositório padrão de projeto API em NodeJs utilizando o MongoDB através do Mongoose;
- `Criar novo Modelo do Mongoose`: que cria um modelo de banco padrão de projeto API em NodeJs utilizando o MongoDB através do Mongoose;