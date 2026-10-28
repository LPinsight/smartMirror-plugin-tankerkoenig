export async function getBevorzugtData (root, config, baseURL) {
  const key = config["tankerkoenig_api_key"]
  const uuid = config["uuid_tankstelle"]
  const type = {
    "Diesel": "diesel"
  }[config["type"]] ?? config["type"]

  const url = `https://creativecommons.tankerkoenig.de/json/prices.php?ids=${uuid}&apikey=${key}`

  const response = await fetch(url)
  const result = await response.json()

  if (!result.ok) {
    console.error("Tankerkönig-Fehler:", result.message)
    return
  }

  root.querySelector("[data-status]").src = `${baseURL}/assets/${result["prices"][uuid].status}.png`

  if(result["prices"][uuid].status === "open") {
      root.querySelector("[data-price]").textContent = result["prices"][uuid].type
  }  
}