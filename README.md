# Pokédex Binary Search Electron App

**Um aplicativo Pokédex baseado em Electron que implementa busca binária para pesquisas rápidas de Pokémon.**

## Descrição
Este projeto é um aplicativo de desktop construído com Electron que permite buscar informações de qualquer Pokémon disponível na [PokéAPI](https://pokeapi.co/). Utiliza um algoritmo de busca binária para oferecer uma experiência interativa, mostrando passo a passo como a busca é realizada e exibindo detalhes visuais atraentes de cada Pokémon.

## Funcionalidades
- Pesquisa por nome de Pokémon usando busca binária com visualização dos passos.  
- Exibição de imagem, tipos, habilidades e estatísticas base com barras de progresso animadas.  
- Dados adicionais: ID formatado, ordem, peso (kg), altura (m), experiência base e status padrão.  
- Layout moderno com design responsivo, cartões estilizados e paleta de cores inspirada na Pokébola.

## Tecnologias
- **Electron** para aplicação desktop.  
- **Node.js** no processo principal para chamadas à API.  
- **Preload Script** com `contextBridge` para comunicação segura entre processos.  
- **HTML/CSS/JS** no renderer com ES Modules e `fetch`.  

## Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/ckzwebber/unesc-binary-search.git
   cd unesc-binary-search
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie o aplicativo:
   ```bash
   npm start
   ```

## Uso
1. Na interface, digite o nome do Pokémon desejado (ex: `pikachu`).  
2. Clique em **Buscar** e acompanhe cada passo da busca binária.  
3. Veja os detalhes completos no painel principal com imagem, estatísticas e informações extras.

## Contribuição
Contribuições são bem-vindas! Abra issues para sugestões ou correções e envie pull requests.

## Licença
MIT © 2025
