let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  displayCards()

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//Display all cards
function displayCards() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      data.forEach((toy) => createCard(toy))
    })
}

//Create card for toy
function createCard(toy) {
  const card = document.createElement("div")
  card.className = "card"
  card.innerHTML = `
    <h2>${toy.name}<\h2>
    <img src="${toy.image}" class="toy-avatar"/>
    <p>${toy.likes} Likes </p>
    <button class="like-btn" id="${toy.id}"}>Like <3</button>`

  //Listener for likes
  card.querySelector(".like-btn").addEventListener("click", () => {
    toy.likes += 1

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": toy.likes
      })
    }).then(res => res.json())
      .then(toy => {
        card.querySelector("p").textContent = `${toy.likes} Likes `
      })
  })

  //Add card to DOM
  document.querySelector("#toy-collection").append(card)
}

const form = document.querySelector(".add-toy-form")
form.addEventListener("submit", handleSubmit)

//Handle Submit
function handleSubmit(event) {
  event.preventDefault()

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": event.target.name.value,
      "image": event.target.image.value,
      "likes": 0
    })
  }).then(res => res.json())
    .then(toy => createCard(toy))
}
