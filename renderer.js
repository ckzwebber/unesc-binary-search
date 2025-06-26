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
        <strong>ID Nacional:</strong> #${String(details.id).padStart(3, "0")}
          </div>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
        <strong>Ordem Pokédex:</strong> ${details.order}
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
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; justify-content: center;">
        ${details.types
          .map((type) => `<span style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; text-transform: uppercase; font-weight: 600;">${type.type.name}</span>`)
          .join("")}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #1f2937;">Habilidades:</strong>
          <div style="margin-top: 8px;">
        ${details.abilities
          .map(
            (ability) => `
            <div style="background: ${ability.is_hidden ? "#f59e0b" : "#10b981"}; color: white; padding: 10px 12px; border-radius: 12px; font-size: 12px; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-bottom: 2px;">
            ${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1).replace(/-/g, " ")}
            ${ability.is_hidden ? '<span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 2px;">OCULTA</span>' : ""}
          </div>
          <div style="font-size: 10px; opacity: 0.9;">
            Slot: ${ability.slot} | ${ability.is_hidden ? "Habilidade especial rara" : "Habilidade padrão"}
          </div>
            </div>
            `
          )
          .join("")}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #1f2937;">Movimentos Disponíveis:</strong>
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; margin-top: 8px;">
        <span style="color: #6b7280; font-size: 12px;">Total de movimentos: ${details.moves.length}</span>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #1f2937;">Estatísticas Base (Total: ${details.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}):</strong>
          <div style="margin-top: 8px;">
        ${details.stats
          .map(
            (stat) => `
            <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <span style="font-size: 12px; text-transform: capitalize; font-weight: 500;">${stat.stat.name.replace(/-/g, " ")}</span>
            <span style="font-weight: bold; color: #374151;">${stat.base_stat}</span>
          </div>
          <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: ${stat.base_stat >= 100 ? "#10b981" : stat.base_stat >= 70 ? "#f59e0b" : "#ef4444"}; height: 100%; width: ${Math.min(
              (stat.base_stat / 200) * 100,
              100
            )}%; transition: width 0.3s ease;"></div>
          </div>
            </div>
            `
          )
          .join("")}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <strong style="color: #1f2937;">Localização de Sprites:</strong>
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; justify-content: center;">
        ${details.sprites.front_default ? '<span style="background: #6366f1; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px;">Frente</span>' : ""}
        ${details.sprites.back_default ? '<span style="background: #6366f1; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px;">Costas</span>' : ""}
        ${details.sprites.front_shiny ? '<span style="background: #fbbf24; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px;">Shiny Frente</span>' : ""}
        ${details.sprites.back_shiny ? '<span style="background: #fbbf24; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px;">Shiny Costas</span>' : ""}
          </div>
        </div>

        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; border-left: 4px solid #6366f1;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Experiência Base:</strong> ${details.base_experience || "N/A"}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>É Forma Padrão:</strong> ${details.is_default ? "Sim" : "Não"}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Índice de Felicidade:</strong> ${details.base_happiness || "N/A"}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Taxa de Captura:</strong> ${details.capture_rate || "N/A"}</p>
          </div>
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
