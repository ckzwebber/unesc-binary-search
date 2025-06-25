# Lista Pokémon com Busca Binária

**Descrição:**  
Aplicação de linha de comando em Node.js que obtém todos os Pokémon da PokeAPI, ordena-os alfabeticamente e permite buscar um Pokémon específico usando pesquisa binária.

## Pré-requisitos

- Node.js v14 ou superior
- Conexão com internet

## Instalação

```bash
git clone https://github.com/ckzwebber/unesc-binary-search
cd unesc-binary-search
npm install
```

## Uso

```bash
node script.js
```

Em seguida, siga as instruções na linha de comando para buscar um Pokémon pelo nome.  
Para sair, digite um número.

## Funcionalidades

- Busca todos os Pokémon usando a PokeAPI.
- Ordena os nomes em ordem alfabética.
- Implementa pesquisa binária para buscas rápidas.
- Exibe os detalhes do Pokémon encontrado:
  - Nome
  - Tipos
  - Número na Pokédex
  - Peso
  - Altura

## Como Funciona

1. Faz fetch da lista completa de Pokémon (`limit=-1`).
2. Extrai os nomes e ordena alfabeticamente.
3. Implementa função de pesquisa binária para encontrar o índice.
4. Faz fetch dos detalhes do Pokémon encontrado e exibe na tela.

## Exemplo de Saída

```
Digite o nome do Pokémon que deseja buscar (ou um número para sair): pikachu

=== Detalhes do Pokémon ===
Nome: pikachu
Tipos: electric
Número Pokedex: 25
Peso: 60
Altura: 4
==========================
```

## Contribuição

Contribuições são bem-vindas!  
1. Fork este repositório  
2. Crie uma branch com sua feature (`git checkout -b feature/NovaFeature`)  
3. Faça commit das suas alterações (`git commit -m 'Add nova feature'`)  
4. Envie para o branch original (`git push origin feature/NovaFeature`)  
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
