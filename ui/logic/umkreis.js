export async function getListData (root, config, baseURL) {
  const key = config["tankerkoenig_api_key"]
  const uuid = config["uuid_tankstelle"]
  const maxAnzahl = config["max_tankstellen"]
  const lat = config["lat"]
  const lon = config["lon"]
  const radius = config["radius"]
  const sort = config["sort"] === "Preis" ? "price" : "dist"
  const filterOpen = config["only_opend"]
  const type = {
    "Diesel": "diesel"
  }[config["type"]] ?? config["type"]

  const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lon}&rad=${radius}&sort=${sort}&type=${type}&apikey=${key}`

  const response = await fetch(url)
  const result = await response.json()

  if (!result.ok) {
    console.error("Tankerkönig-Fehler:", result.message)
    return
  }

  let stations = result.stations.filter(station =>
    typeof station.price === "number" && station.price > 0
  )
  
  if(filterOpen) {
    stations = stations.filter(station =>
      station.isOpen == true
    )
  }

  const sichtbareStationen = stations.slice(0, maxAnzahl)
  const liebling = stations.find(station => station.id === uuid)
  
  if (
    liebling &&
    !sichtbareStationen.some(station => station.id === uuid) &&
    sichtbareStationen.length > 0
  ) {
    sichtbareStationen[sichtbareStationen.length - 1] = liebling
  }

  const preise = sichtbareStationen.map(station => station.price)
  const günstigsterPreis = Math.min(...preise)
  const teuersterPreis = Math.max(...preise)

  const container = root.querySelector("[data-stations]");
  const template = root.querySelector("#station-template");

  container.innerHTML = ""; // alte Einträge löschen

  for (const station of sichtbareStationen) {
    const element = template.content.cloneNode(true)
    
    element.querySelector("[data-price]").textContent = station.price
    element.querySelector("[data-city]").textContent = station.place
    element.querySelector("[data-distanz]").textContent = station.dist

    if(station.brand != "") {
      element.querySelector("[data-name]").textContent = station.brand
    } else {
      element.querySelector("[data-name]").textContent = station.name
    }

    if (station.id === uuid) {
      element.querySelector("li").classList.add("bevorzugt")
    }

    if (station.price === günstigsterPreis) {
      element.querySelector("li").classList.add("günstigste")
    }

    if (station.price === teuersterPreis) {
      element.querySelector("li").classList.add("teuerste")
    }

    if (station.isOpen === false) {
      element.querySelector("li").classList.add("close")
    }

    container.appendChild(element)
  }
}