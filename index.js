const $spinner = document.querySelector("[data-spinner]");
const $wrapper = document.querySelector("[data-wrapper]");

const $img = document.querySelector("#image");
const $name = document.querySelector(".cat__name");
const $age = document.querySelector("#age");
const $descript = document.querySelector(".cat__disc");
const $rating = document.querySelector("#rate");
const $like = document.querySelector(".like");

const $modal = document.querySelector("[data-modal]");
const $modalShow = document.querySelector("[data-modal-info]");
const $modalEdit = document.querySelector("[data-modal-edit]");
const $closeModalBtns = document.querySelectorAll("#close-modal");
const $addBtn = document.querySelector("[data-add_button]");
const $error = document.querySelector("#error");

$addBtn.addEventListener("click", () => {$modal.classList.remove("hidden")});
$closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {event.target.closest(".modal-wrapper").classList.add("hidden")});
});

const api = new Api("https://cats.petiteweb.dev/api/single/", "evgen");

getAllCats();

$wrapper.addEventListener("click", (event) => {
  switch (event.target.dataset.action) {
    case "show":
      showCatModal(event);
      break;
    case "delete":
      deleteCat(event);
      break;
    case "edit":
      editCat(event);
      break;
    default:
      break;
  }
});

async function getAllCats() {
  $wrapper.innerHTML = null;
  $modal.classList.add("hidden");
  $modalEdit.classList.add("hidden");
  $spinner.classList.remove("hidden");
  const response = await api.getCats();
  const data = await response.json();
  setTimeout(() => {
    $spinner.classList.add("hidden");
    data.forEach((cat) => {
      $wrapper.insertAdjacentHTML("beforeend", generateCatCard(cat));
    });
  }, 1000);
}

function generateCatCard(cat) {
  return `<div class="card mx-2" data-id=${cat.id} style="width: 18rem;">
  <img src=${cat.image} class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
    <button data-action="show" class="btn btn-primary">Show</button>
    <button data-action="delete" class="btn btn-danger">Delete</button>
    <button data-action="edit" class="btn btn-success">Edit</button>
  </div>
  </div>`;
}

function showCatModal(event) {
  $spinner.classList.remove("hidden");
  let currentId = event.target.closest(".card").dataset.id;
  api
    .getCat(currentId)
    .then((response) => response.json())
    .then((data) => generateCatHtml(data));

  function generateCatHtml(data) {
    $img.src = data.image;
    $name.innerHTML = data.name;
    $age.innerHTML = data.age;
    $descript.innerHTML = data.description;
    $rating.innerHTML = data.rate;
    data.favorite
      ? ($like.style.display = "block")
      : ($like.style.display = "none");
    setTimeout(() => {
      $spinner.classList.add("hidden");
      $modalShow.classList.remove("hidden");
    }, 500);
  }
}

function deleteCat(event) {
  let currentCat = event.target.closest(".card");
  let currentId = event.target.closest(".card").dataset.id;
  api.deleteCat(currentId);
  // currentCat.outerHTML = null;
  currentCat.remove();
}

function editCat(event) {
  $spinner.classList.remove("hidden");
  let currentId = event.target.closest(".card").dataset.id;
  api
    .getCat(currentId)
    .then((response) => response.json())
    .then((data) => fillForm(data));
  function fillForm(data) {
    let editedForm = document.forms.catsFormEdit;
    editedForm.age.value = data.age;
    editedForm.description.value = data.description;
    editedForm.favorite.checked = data.favorite;
    editedForm.id.value = data.id;
    editedForm.image.value = data.image;
    editedForm.name.value = data.name;
    editedForm.rate.value = data.rate;
  }
  setTimeout(() => {
    $spinner.classList.add("hidden");
    $modalEdit.classList.remove("hidden");
  }, 500);
}

document.forms.catsFormEdit.addEventListener("submit", (event) => {
  event.preventDefault();
  let currentId = +event.target.id.value;
  const data = Object.fromEntries(new FormData(event.target).entries());
  data.favorite = data.favorite === "on";
  api
    .updateCat(data, currentId)
    .then((response) => (response.ok ? getAllCats() : response.json()))
    .then((error) => console.log(error));
});

document.forms.catsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  data.favorite = data.favorite === "on";
  data.id = +data.id;
  data.age = +data.age;
  data.rate = +data.rate;
  api
    .addCat(data)
    .then((response) => (response.ok ? getAllCats() : response.json()))
    .then((error) => ($error.innerHTML = error?.message));
});
