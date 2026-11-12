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


  const container = root.querySelector("[data-nearby-stations]");
  const template = root.querySelector("#station-template");

  container.innerHTML = ""; // alte Einträge löschen

  for (let i = 0; i < maxAnzahl; i++) {
    const element = template.content.cloneNode(true)
    const imgName = stations[i].isOpen? "open" : "closed"
    
    element.querySelector("[data-price]").textContent = stations[i].price
    element.querySelector("[data-city]").textContent = stations[i].place
    element.querySelector("[data-distanz]").textContent = stations[i].dist
    element.querySelector("[data-status]").src = `${baseURL}/assets/${imgName}.png`

    if(stations[i].brand != "") {
      element.querySelector("[data-name]").textContent = stations[i].brand
    } else {
      element.querySelector("[data-name]").textContent = stations[i].name
    }

    if (stations[i].id === uuid) {
      root.querySelector("[data-price]").textContent = stations[i].price
    }

    container.appendChild(element)
  }
  
}