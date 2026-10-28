class tankerkoenigPlugin extends HTMLElement {
  async connectedCallback() {
    const config = this.config || {};

    const fuelTypeName = {
      "e5": "Super",
      "e10": "Super E10",
    }[config["type"]] ?? config["type"]

    // Basis-URL aus Attribut
    const baseUrl = this.getAttribute('base-url');
    if (!baseUrl) throw new Error("base-url attribute is required");
    this.baseUrl = baseUrl

    // 1. CSS laden
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `${baseUrl}/style.css`;
    this.appendChild(style);

    // 2. HTML laden
    const htmlResponse = await fetch(`${baseUrl}/template.html`);
    const html = await htmlResponse.text();
    this.innerHTML += html; // HTML in Shadow DOM oder direkt ins Element

    this.querySelector("[data-fuel-type]").textContent = fuelTypeName

    // 3. Logik
    
    // Module laden
    const umkreisModule = await import(`${baseUrl}/logic/umkreis.js`);
    const bevorzugtModule = await import(`${baseUrl}/logic/bevorzugt.js`);

    this.umkreis = umkreisModule
    this.bevorzugt = bevorzugtModule

    this.updateView()

    setInterval(() => this.updateView(), 1000*60* config["updateInterval"]); // alle x Minuten
  }

  updateView() {
    this.umkreis.getListData(this, this.config, this.baseUrl)
    this.bevorzugt.getBevorzugtData(this, this.config, this.baseUrl)

    const parts = new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());

    const hours = parts.find(part => part.type === "hour").value;
    const minutes = parts.find(part => part.type === "minute").value;
    this.querySelector("[data-last-refresh]").textContent = `${hours}:${minutes}`    
  }
}

customElements.define('smartmirror-plugin-tankerkoenig', tankerkoenigPlugin);