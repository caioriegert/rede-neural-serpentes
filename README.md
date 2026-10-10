# SnakeID — Identificação de Serpentes e Primeiros Socorros

Trabalho da disciplina de Inteligência Artificial. A aplicação recebe uma foto
de uma cobra, identifica a espécie usando uma rede neural treinada no Google
Teachable Machine e exibe orientações de primeiros socorros geradas pela API
da Anthropic (Claude).

## Espécies reconhecidas

- Jararaca (peçonhenta)
- Cascavel (peçonhenta)
- Cobra coral verdadeira (peçonhenta)
- Cobra coral falsa (não peçonhenta)
- Jiboia (não peçonhenta)

## Como executar

A aplicação é puramente front-end, mas usa ES modules e por isso precisa ser
servida por um servidor HTTP (não funciona abrindo o arquivo direto no
navegador).

1. Renomeie a chave da API no arquivo `assets/js/config.js` (variável
   `CLAUDE_API_KEY`).

2. Na raiz do projeto, suba um servidor estático. Qualquer um serve. Exemplos:

   ```
   python3 -m http.server 8000
   ```

   ou, se preferir, a extensão *Live Server* do VS Code.

3. Abra `http://localhost:8000` no navegador.

4. Envie ou arraste uma foto de cobra e clique em "Identificar cobra".

## Estrutura de pastas

```
.
├── index.html
├── assets/
│   ├── css/        folhas de estilo separadas por componente
│   ├── js/         módulos JavaScript (ES modules)
│   └── img/        logo institucional
└── dataset/        imagens usadas para treinar o modelo
    ├── cascavel/
    ├── coral-fake/
    ├── coral-verdadeira/
    ├── jararaca/
    └── jiboia/
```

Os módulos JavaScript estão separados por responsabilidade:

- `config.js` — constantes (URL do modelo, modelo da API, espécies)
- `utils.js` — funções utilitárias
- `ui.js` — manipulação de elementos da interface
- `fileHandler.js` — upload e pré-visualização da imagem
- `classifier.js` — carregamento e uso do modelo treinado
- `claudeApi.js` — comunicação com a API da Anthropic
- `main.js` — ponto de entrada e registro de eventos

## Como o modelo foi criado

O modelo de classificação foi treinado no Google Teachable Machine, na
modalidade de classificação de imagens. Para cada uma das cinco classes
foram enviadas as fotos presentes na pasta `dataset/`. Após o treinamento,
o modelo foi exportado em formato TensorFlow.js e hospedado no próprio
Teachable Machine. A aplicação carrega o modelo em tempo de execução através
do endereço definido em `assets/js/config.js`.

## Tecnologias utilizadas

- HTML, CSS e JavaScript puros
- TensorFlow.js e a biblioteca cliente do Teachable Machine
- API da Anthropic (Claude) para geração das orientações médicas

## Observações

- Em caso real de picada, a recomendação é ligar para o SAMU (192) ou
  procurar o hospital mais próximo. Esta ferramenta tem caráter
  educacional.
- A chave da API utilizada no front-end fica visível para qualquer usuário
  do site. Em um cenário de produção o ideal seria fazer a chamada através
  de um servidor que mantivesse a chave em segredo.