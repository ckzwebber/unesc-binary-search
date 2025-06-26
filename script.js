const readline = require("readline");

async function main() {
  const respostaLista = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const dadosLista = await respostaLista.json();

  const listaPokemons = dadosLista.results.map((pokemon) => ({
    nome: pokemon.name.toLowerCase(),
    url: pokemon.url,
  }));

  listaPokemons.sort((first, another) => first.nome.localeCompare(another.nome));

  const leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const perguntaAoUsuario = (texto) => new Promise((res) => leitor.question(texto, res));

  const cacheDetalhes = new Map();

  while (true) {
    const entradaUsuario = (await perguntaAoUsuario("Digite o nome do Pokémon (ou um número para sair): ")).trim().toLowerCase();

    if (entradaUsuario === "" || !isNaN(entradaUsuario)) {
      console.log("Programa encerrado.");
      break;
    }

    const pokemonEncontrado = buscaBinaria(listaPokemons, entradaUsuario);
    if (!pokemonEncontrado) {
      console.log("Pokémon não encontrado.\n");
      continue;
    }

    let detalhes = cacheDetalhes.get(pokemonEncontrado.nome);
    if (!detalhes) {
      try {
        const respostaDetalhes = await fetch(pokemonEncontrado.url);
        if (!respostaDetalhes.ok) throw new Error();
        detalhes = await respostaDetalhes.json();
        cacheDetalhes.set(pokemonEncontrado.nome, detalhes);
      } catch {
        console.log("Erro ao buscar detalhes.\n");
        continue;
      }
    }

    console.log("\n=== Detalhes do Pokémon ===");
    console.log(`Nome: ${detalhes.name}`);
    console.log(`Tipos: ${detalhes.types.map((type) => type.type.name).join(", ")}`);
    console.log(`Número na Pokédex: ${detalhes.id}`);
    console.log(`Peso: ${detalhes.weight}`);
    console.log(`Altura: ${detalhes.height}`);
    console.log("==========================\n");
  }

  leitor.close();
}

function buscaBinaria(arrayPokemons, nomeAlvo) {
  let inicio = 0;
  let fim = arrayPokemons.length - 1;

  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);
    const nomeDoMeio = arrayPokemons[meio].nome;

    if (nomeDoMeio === nomeAlvo) {
      return arrayPokemons[meio];
    } else if (nomeDoMeio < nomeAlvo) {
      inicio = meio + 1;
    } else {
      fim = meio - 1;
    }
  }
  return null;
}

main();
