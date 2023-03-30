class Api {
  constructor(baseUrl, name) {
    this.url = `${baseUrl}${name}`;
  }
  getCats() {
    return fetch(`${this.url}/show`);
  }
  getCatsID() {
    return fetch(`${this.url}/ids`);
  }
  getCat(id) {
    return fetch(`${this.url}/show/${id}`);
  }
  deleteCat(id) {
    return fetch(`${this.url}/delete/${id}`, {
      method: "DELETE",
    });
  }
  addCat(bodyCat) {
    return fetch(`${this.url}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyCat),
    });
  }
  updateCat(changedBody, id) {
    return fetch(`${this.url}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedBody),
    });
  }
}
