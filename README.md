BitValor
========

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![bitHound Code](https://www.bithound.io/github/brunocarvalhodearaujo/order-book/badges/code.svg)](https://www.bithound.io/github/brunocarvalhodearaujo/order-book)
[![bitHound Overall Score](https://www.bithound.io/github/brunocarvalhodearaujo/order-book/badges/score.svg)](https://www.bithound.io/github/brunocarvalhodearaujo/order-book)
[![bitHound Dependencies](https://www.bithound.io/github/brunocarvalhodearaujo/order-book/badges/dependencies.svg)](https://www.bithound.io/github/brunocarvalhodearaujo/order-book/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/brunocarvalhodearaujo/order-book/badges/devDependencies.svg)](https://www.bithound.io/github/brunocarvalhodearaujo/order-book/master/dependencies/npm)

Este projeto recupera os dados do livro de ofertas (ORDER BOOK) do [bitvalor](http://bitvalor.com/api) e permite a busca
atraves de filtros atraves de uma api REST.

### Rodando o servidor no localhost

````sh
$ git clone https://github.com/brunocarvalhodearaujo/order-book.git
$ cd bitvalor
$ npm install
$ npm start
````

### Consulta de ordens de compra e venda atraves de filtros

Esta consulta permite obter as ordens de compra e venda utilizando filtros.

Quando o servidor for iniciado e possível acessar a api atraves da URL:

```sh
http://localhost:3000/orders?type=bids&exchange=LOC&min_value=10000.00&max_value=15000.00&max_quantity=0.068965517241379
```

#### Parâmetros de Consulta

| Campo | Tipo | Obrigatória | Descrição |
|-------|------|----------|-----------|
|type|String|sim|tipo da requisição (bids ou asks)|
|exchange|String|não|cada exchange é um grupo, representado por seu código conforme legenda [ARN, B2U, BAS, BIV, BSQ, FLW, FOX, LOC, MBT, NEG, PAX]|
|min_value|Number|não|valor minimo|
|max_value|Number|não|valor maximo|
|min_quantity|Number|não|quantidade minima (BTC)|
|max_quantity|Number|não|quantidade maximo (BTC)|

#### Exemplo de resposta

A resposta da consulta de transações é dada em formato JSON. Veja uma resposta no exemplo abaixo.

````json
{
  "bids": [
    {
      "exchange": "LOC",
      "price": 14050,
      "btc": 0.0355871886121
    },
    {
      "exchange": "LOC",
      "price": 12111,
      "btc": 0.0016513912971679
    }
  ]
}
````
