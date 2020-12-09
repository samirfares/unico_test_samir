# Teste processo seletivo Unico.

---

## Requisitos

NodeJS: v10 ou superior - https://nodejs.org/en/
RedisServer v5 ou superior - https://redis.io/topics/quickstart

A aplicação roda localmente por padrão na porta 8080.

## Instruções

### Navegar para a root do projeto
```sh
cd teste_unico_samir
```

### Instalar dependências do package.json rodando o comando:

```sh
npm install
```


### Criar pastas credentials e documents dentro da root do projeto:

```sh
mkdir credentials
mkdir documents
```

### Criar um arquivo .env semelhante ao .env.example e setar as urls e credenciais (omitinndo por segurança)
```
SERVICE_ACCOUNT=xxxxxxx
TENANT=xxxxxxxxxx
IDENTITY_URL=https://xxxxxx.io
ACESSO_SERVICE_API_URL=https://xxxxxxx/api/v1/service
```


### Rodar a aplicação:

```sh
npm start
```

---

## Endpoints


### [GET] ../api/health
    Informa se a aplicação está rodando.

###### Request

```sh
curl --location --request GET 'http://34.69.203.102/api/health' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUzLCJpYXQiOjE2MDczNjkwMTEsImV4cCI6MTYwNzQ1NTQxMX0.mbw5lEMo0b-APn28yd-C0b82xwWXl5dT3Lm2eK4UrDI'
```

###### Response
```json
    {
        status: 200,
        message: "Server Healthy"
    }
```

### [POST] ../api/envelope

###### Request

```sh
curl --location --request POST 'http://34.69.203.102/api/envelope' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUzLCJpYXQiOjE2MDczNjkwMTEsImV4cCI6MTYwNzQ1NTQxMX0.mbw5lEMo0b-APn28yd-C0b82xwWXl5dT3Lm2eK4UrDI' \
--form 'document=@"/Users/samirfares/Documents/img20200802_00040586.pdf"' \
--form 'name="Samir Riad Varandas Fares"' \
--form 'cpf="36956288800"'
```

###### Response
```json
 {
    "status": 200,
    "message": "Envelope Sent",
    "result": {
        "Success": true,
        "Message": "",
        "Data": {
            "CreatedDate": "09/12/2020 17:13",
            "ID_EnvelopeStatus": 1,
            "EnvelopeStatus": "Pendente",
            "UUID": "2b94e4f2-4f17-4a8b-bd1b-f237a261d691",
            "HasFrame": false,
            "Documents": [
                {
                    "Url": "https://api-dot-acesso-sign-test.appspot.com/api/v1/service/file/7c4a2666-7aa8-4d74-b819-0c05e101698a",
                    "DocumentType": "Teste Documento Samir",
                    "CreatedDate": "09/12/2020 17:13",
                    "EmitterUserName": "Samir",
                    "EmitterUserEmail": "samirvarandas@gmail.com",
                    "CompanySocialName": "Teste Técnico",
                    "UUID": "7c4a2666-7aa8-4d74-b819-0c05e101698a",
                    "Subscribers": [
                        {
                            "SubscriberName": "Samir Riad Varandas Fares",
                            "SubscriberCPF": "36956288800",
                            "SubscriberEmail": "samirvarandas@gmail.com",
                            "SubscriberPhone": "5511981452487",
                            "SubscriberRole": 1
                        }
                    ]
                }
            ]
        }
    }
}
```


---


###Sugerir arquitetura para persistir os documentos enviados.

- Acredito que a melhor maneira de persistir os documentos, seria na nuvem, através de um Bucket como AWS S3 ou Azure/Google Storage por exemplo, devido a quantidade alta de documentos que seriam armazenados, o ideal seria isolar isto das próprias máquinas da aplicação e si. 

###Sugerir arquitetura para colocar o sistema em produção.

- Acredito que uma arquitetura de microservicos seja a mais adequada, por 2 motivos, isolar a parte de autenticação do sistema que tende a ser chamada muitas vezes de maneira desnessária por mal uso dos clientes. E poder escalar apenas as partes do sistemma que mais convém e assim economizar recursos. Alem disso, acredito um banco relacional centralizado, e tambémm um servidor de cache Redis central se faz necessário para trazer dados que são requisitados com uma certa frequencia sem onerar o DB. 
Implementaria também algum sistema de fila, como RabbitMq, Bull ou SQS, para organizar operações de escrita(para processamento posterior em caso de alta carga), e também implentaria um sistema de rate limiting.

###Sugerir novas funcionalidades para o sistema.

- Verifiquei que as seguintes operações existem na API e estariam prontas para integração:Busca de envelopes, Cancelamento de Envelope, Consulta de Arquivo, Consulta do Conjunto de Evidências, Criação de envelope por Modelo, Consulta dos Dados de Modelo, Criação de Contatos. Então essas funcionalidades já poderiam ser suportadas.
O endpoint atual de criação de envelope é muito engessado no sistema que eu fiz(devido aos requisitos simples do teste). Eu deixaria ele mais robusto e configurável. Podendo mandar para mais assinnantes, enviar mais documentos dentro do envelope, etc. Outra possibilidade seria integrar com uma base de dados do próprio cliente. Enfim como esse sistema é um simples "Wrapper" para as APIS da Unico, eu não vejo mais funncionalidades possíveis além de integrar de fato com um sistema externo, ou expor novas integrações existentes das APIs já citadas.