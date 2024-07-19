# Exercicio de manipulação de dados com Nodejs Streams

#### A resolução completa do exercicio que estou propondo está dentro da pasta src, então recomendo que criem uma branch separada para resolverem com sua própria lógica ou então crie uma outra pasta na raiz do projeto caso queira realizar alguma consulta na minha resolução ;)

_Antes de começar, instale as dependências do projeto_

Caso se sinta confortavel para fazer o exercício com typescript, apenas execute o comando

> npm install

Caso contrario, apenas remova as dependencias do typescript do projeto:

```json
  "devDependencies": {
  > "@types/node": "^20.14.11",
  >  "tsx": "^4.16.2",
  >  "typescript": "^5.5.3"
  }
```

E altere os scripts para a forma que ficar melhor para que você execute os comandos com mais facilidade.

```json
   "scripts": {
   > "dev:fakeEtl": "tsx ./src/fakeEtl.ts",
   > "dev:generateCsv": "tsx ./src/generateCsv.ts"
  },
```

## Vamos lá!

### Overview

O exercicio foi criado para você exercitar seu conhecimento sobre nodejs stream (e aplicar um pouco da sua lógica, claro).
A ideia principal é manipular um csv e gerar alguns resultados com ele, primeiro precisamos criar esse csv para conseguirmos seguir para as próximas etapas.

#### ⬢ Etapa 1

Após ter instalado as dependências do projeto, utilize a lib `random-words` para gerar as palavras aleatórias dentro do csv.

- Dicas:

  1.  Utilize os métodos `fs.createWriteStream` do modulo `fs` do NodeJS para escrever os dados em um formato csv (use a , como separador de palavras e colunas)
  2.  Uma função geradora pode servir muito bem para passar os dados para a `writeStream` na pipe ou pipeline de processamento.
  3.  Tente deixar a forma como esse csv é escrito, de forma dinâmica, podendo passar numeros pequenos como 2 por exemplo ou até mesmo numeros gigantes, como 1e6, 1e7 etc.

- Regras:
  1.  Faça uma tratativa para o caso do numero se linhas enviado no parametro da função ser 0 (é impossivel manipular 0 palavras de 0 linhas de csv né? :D)
  2.  Não existe logica errada, pense em como resolver o exercício da sua forma, consulte o canal do Erick Wendel em caso de duvidas ou a documentação oficial do NodeJS

#### ⬢ Etapa 2

Após ter gerado o csv, vamos começar a trabalhar no fakeETL (fake pelo fato de não estarmos realmente fazendo uma extração de dados de diversas fontes, levando em conta também a complexidade da extração).

1. **_Leia_** cada linha do csv como json, para que possamos fazer uma manipulação de forma mais facil.
   - DICA: Lembre-se de usar a lib `csv-parser` para te ajudar nessa tarefa, vai ficar moleza usando ela ;)
2. Após fazer a leitura, escolha uma quantidade de colunas para trabalhar (por exemplo: a,b,c).
3. Quero que na coluna A tenha apenas palavras com a letra a, caso nas 3 colunas escolhidas não exista 1 palavra com a letra A, a chave a deve receber uma string vazia.
   - DICA: Caso as colunas escolhidas não tenham nenhuma palavra com as respectivas iniciais você **PODE** retornar false para ajudar em alguma tratativa futura.

| A        | B      | C         |
| -------- | ------ | --------- |
| game     | push   | xernas    |
| text     | force  | apache    |
| cool     | alpha  | bisguerna |
| american | pirate | car       |

O resultado esperado deve ser o seguinte

```json
[
  false,
  {
    "A": "apache",
    "B": "",
    "C": ""
  },
  {
    "A": "alpha",
    "B": "bisguerna",
    "C": "cool"
  },
  {
    "A": "american",
    "B": "",
    "C": "car"
  }
]
```

4. Agora que os dados estão ordenados, chegou a hora de transforma-los novamente em um formato que possa ser adicionado em um csv, o resultado deve chegar proximo a isso:

```
RESULTADO:
line1 -> não adiciona nada, ja que é false
line2 -> apache,,
line3 -> alpha,bisguerna,cool
line4 -> american,,car
```

5. Após transformar esses dados em um formato csv, basta passa-los para a proxima fase da sua pipe ou pipeline.
   - DICA: Não se esqueça de duas coisas importantes:
     1. Lembre-se de adicionar o header (o nome das colunas) antes de começar a adicionar as linhas.
     2. para cada linha, lembre-se de quebrar as linhas.

```
CSV FINAL:
A,B,C
apache,,
alpha,bisguerna,cool
american,,car
```

#### ⬢ Etapa 3 - Final

Agora estamos proximos de finalizar :)

1. Essa tarefa é objetiva e simples! Transformar o csv inteiro em um arquivo JSON. Essa vai ser moleza pra você!

- DICAS:
  1.  Lembre-se de que como seu CSV vai ter + de 1 linha, ele será um array de objetos, então assim como você adicionou o header no csv, você precisará adicionar um [ na 1° escrita do arquivo JSON.
  2.  Não se esqueça que também precisa fechar o ] que você abriu.
  3.  Será preciso adicionar {}, (virgulas) a cada linha que você enviar para a stream de escrita.

### Boa sorte! :)
