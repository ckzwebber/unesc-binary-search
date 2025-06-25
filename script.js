const readline = require("readline");

async function main() {
  const lerLinha = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const pergunta = (questao) => {
    return new Promise((resolve) => {
      lerLinha.question(questao, resolve);
    });
  };

  let listaPokemon = await fetch("https://pokeapi.co/api/v2/pokemon?limit=-1");
  listaPokemon = await listaPokemon.json();
  let pokemons = listaPokemon.results;
  let arrayPokemonNomes = [];

  pokemons.forEach((pokemon) => {
    arrayPokemonNomes.push(pokemon.name);
  });
  arrayPokemonNomes.sort();
  let pokemonsOrdenados = pokemons.sort((a, b) => a.name.localeCompare(b.name));

  let pokemonPesquisado;

  do {
    pokemonPesquisado = await pergunta("Digite o nome do Pokémon que deseja buscar (ou um número para sair): ");

    if (!isNaN(pokemonPesquisado) && pokemonPesquisado.trim() !== "") {
      console.log("Programa encerrado.");
      break;
    }

    const resposta = pesquisaBinaria(arrayPokemonNomes, pokemonPesquisado.toLowerCase());

    if (resposta === false) {
      console.log("Pokemon não encontrado");
      continue;
    }

    let pokemonEncontrado = pokemonsOrdenados[resposta];

    let pokemonDetalhes = await fetch(pokemonEncontrado.url);
    pokemonDetalhes = await pokemonDetalhes.json();
    console.log("\n=== Detalhes do Pokémon ===");
    console.log("Nome: " + pokemonDetalhes.name);
    console.log("Tipos: " + pokemonDetalhes.types.map((tipo) => tipo.type.name).join(", "));
    console.log("Número Pokedex: " + pokemonDetalhes.id);
    console.log("Peso: " + pokemonDetalhes.weight);
    console.log("Altura: " + pokemonDetalhes.height);
    console.log("==========================\n");
  } while (true);

  lerLinha.close();

  function pesquisaBinaria(listaPokemon, pokemonPesquisado) {
    let comeco = 0;
    let fim = listaPokemon.length - 1;

    while (comeco <= fim) {
      let meioQuebrado = (comeco + fim) / 2;
      let meio = Math.floor(meioQuebrado);

      if (listaPokemon[meio] === pokemonPesquisado) return meio;
      else if (listaPokemon[meio] < pokemonPesquisado) {
        comeco = meio + 1;
      } else {
        fim = meio - 1;
      }
    }
    return false;
  }
}

main();
