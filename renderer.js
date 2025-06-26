window.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("pokemon-input");
  const buttonElement = document.getElementById("search-button");
  const stepsListElement = document.getElementById("steps-list");
  const detailsPanelElement = document.getElementById("details-panel");
  let sortedPokemons = [];

  async function initList() {
    try {
      const listResponse = await window.api.fetchList();
      sortedPokemons = listResponse.results.map((item) => ({ name: item.name.toLowerCase(), url: item.url })).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    }
  }

  buttonElement.addEventListener("click", () => {
    performBinarySearch(inputElement.value.trim().toLowerCase());
  });

  async function performBinarySearch(targetName) {
    stepsListElement.innerHTML = "";
    detailsPanelElement.innerHTML = "";
    if (!targetName || !sortedPokemons.length) return;

    let leftIndex = 0;
    let rightIndex = sortedPokemons.length - 1;
    let foundPokemon = null;

    while (leftIndex <= rightIndex) {
      const midIndex = Math.floor((leftIndex + rightIndex) / 2);
      const midName = sortedPokemons[midIndex].name;
      const stepItem = document.createElement("li");
      stepItem.textContent = `Comparando com ${midName} (índice ${midIndex}) faixa [${leftIndex}, ${rightIndex}]`;
      stepsListElement.appendChild(stepItem);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (midName === targetName) {
        foundPokemon = sortedPokemons[midIndex];
        break;
      }
      if (midName < targetName) leftIndex = midIndex + 1;
      else rightIndex = midIndex - 1;
    }

    if (!foundPokemon) {
      const message = document.createElement("p");
      message.textContent = "Pokémon não encontrado.";
      detailsPanelElement.appendChild(message);
      return;
    }

    try {
      const details = await window.api.fetchDetails(foundPokemon.url);
      const imageElement = document.createElement("img");
      imageElement.src = details.sprites.front_default;
      const infoContainer = document.createElement("div");
      infoContainer.innerHTML = `
        <h3 style="color: #2563eb; margin-bottom: 16px; font-size: 24px;">${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
        <strong>ID:</strong> #${String(details.id).padStart(3, "0")}
      </div>
      <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
        <strong>Ordem:</strong> ${details.order}
      </div>
      <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
        <strong>Peso:</strong> ${(details.weight / 10).toFixed(1)} kg
      </div>
      <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
        <strong>Altura:</strong> ${(details.height / 10).toFixed(1)} m
      </div>
        </div>
        <div style="margin-bottom: 16px;">
      <strong style="color: #1f2937;">Tipos:</strong>
      <div style="gap: 8px; margin-top: 8px;">
        ${details.types
          .map((type) => `<span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px; margin-right: 8px; text-transform: uppercase;">${type.type.name}</span>`)
          .join("")}
      </div>
        </div>
        <div style="margin-bottom: 16px;">
      <strong style="color: #1f2937;">Habilidades:</strong>
      <div style="margin-top: 8px; margin-bottom: 8px;">
        ${details.abilities
          .map(
            (ability) => `
        <div style="background: #10b981; color: white; padding: 8px 12px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; display: block;">
          <div style="font-weight: bold; margin-bottom: 2px;">
            ${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1).replace("-", " ")}
            ${ability.is_hidden ? '<span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 8px;">OCULTA</span>' : ""}
          </div>
          <div style="font-size: 10px; opacity: 0.9;">
            Slot: ${ability.slot}
          </div>
        </div>
          `
          )
          .join("")}
      </div>
        </div>
        <div style="margin-bottom: 16px;">
      <strong style="color: #1f2937;">Estatísticas Base:</strong>
      <div style="margin-top: 8px;">
        ${details.stats
          .map(
            (stat) => `
          <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <span style="font-size: 12px; text-transform: capitalize;">${stat.stat.name.replace("-", " ")}</span>
          <span style="font-weight: bold; color: #374151;">${stat.base_stat}</span>
        </div>
        <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981); height: 100%; width: ${Math.min((stat.base_stat / 200) * 100, 100)}%; transition: width 0.3s ease;"></div>
        </div>
          </div>
        `
          )
          .join("")}
      </div>
        </div>
        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; border-left: 4px solid #6366f1;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Experiência Base:</strong> ${details.base_experience}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;"><strong>É Padrão:</strong> ${details.is_default ? "Sim" : "Não"}</p>
        </div>
      `;
      detailsPanelElement.appendChild(imageElement);
      detailsPanelElement.appendChild(infoContainer);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Erro ao buscar detalhes.";
      detailsPanelElement.appendChild(errorMsg);
    }
  }

  initList();
});
