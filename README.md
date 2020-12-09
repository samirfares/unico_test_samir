Teste processo selectivo acesso.

Requisitos

NodeJS: v10 ou superior - https://nodejs.org/en/
RedisServer v5 ou superior - https://redis.io/topics/quickstart

Instruções

Instalar dependências do package.json rodando o comando:
```npm install```

Rodar a aplicação:
```node index.js```


Sugerir arquitetura para persistir os documentos enviados.

- Acredito que a melhor maneira de persistir os documentos, seria na nuvem, através de um Bucket como AWS S3 ou Azure/Google Storage por exemplo, devido a quantidade alta de documentos que seriam armazenados, o ideal seria isolar isto das próprias máquinas da aplicação e si. 

Sugerir arquitetura para colocar o sistema em produção.

- Acredito que uma arquitetura de microservicos seja a mais adequada, por 2 motivos, isolar a parte de autenticação do sistema que tende a ser chamada muitas vezes de maneira desnessária por mal uso dos clientes. E poder escalar apenas as partes do sistemma que mais convém e assim economizar recursos. Alem disso, acredito um banco relacional centralizado, e tambémm um servidor de cache Redis central se faz necessário para trazer dados que são requisitados com uma certa frequencia sem onerar o DB. 
Implementaria também algum sistema de fila, como RabbitMq, Bull ou SQS, para organizar operações de escrita(para processamento posterior em caso de alta carga), e também implentaria um sistema de rate limiting.

Sugerir novas funcionalidades para o sistema.

- Verifiquei que as seguintes operações existem na API e estariam prontas para integração:Busca de envelopes, Cancelamento de Envelope, Consulta de Arquivo, Consulta do Conjunto de Evidências, Criação de envelope por Modelo, Consulta dos Dados de Modelo, Criação de Contatos. Então essas funcionalidades já poderiam ser suportadas.
O endpoint atual de criação de envelope é muito engessado no sistema que eu fiz(devido aos requisitos simples do teste). Eu deixaria ele mais robusto e configurável. Podendo mandar para mais assinnantes, enviar mais documentos dentro do envelope, etc. Outra possibilidade seria integrar com uma base de dados do próprio cliente. Enfim como esse sistema é um simples "Wrapper" para as APIS da Unico, eu não vejo mais funncionalidades possíveis além de integrar de fato com um sistema externo, ou expor novas integrações existentes das APIs já citadas.