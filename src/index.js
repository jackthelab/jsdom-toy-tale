const BASE_URL = 'http://localhost:3000/toys/'
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const addToyBtn = document.querySelector("#add-toy-form")
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  addToyBtn.addEventListener('submit', handleNewToyForm);
  fetchToys();
  
});

async function fetchToys(){
  const response = await fetch('http://localhost:3000/toys');
  const toyData = await response.json();

  toyData.forEach(toy => {renderToy(toy)});

}

function renderToy(toy){

  const newCard = document.createElement('div')
    newCard.classList.add('card');

  const cardImg = document.createElement('img')
    cardImg.src = toy.image
    cardImg.classList.add('toy-avatar')
  
  const cardBody = document.createElement('div')

  const cardTitle = document.createElement('h2')
    cardTitle.innerText = toy.name

  const cardLikes = document.createElement('p')
    cardLikes.innerText = toy.likes
    cardLikes.classList.add('likes')
  
  const cardLikeBtn = document.createElement('button')
    cardLikeBtn.classList.add('like-btn');
    cardLikeBtn.innerText = "Like"
    cardLikeBtn.id = `like-${toy.id}`
    cardLikeBtn.addEventListener('click', addLike);
  
  const removeToyBtn = document.createElement('button')
    removeToyBtn.classList.add('btn');
    removeToyBtn.innerText = "Remove Toy";
    removeToyBtn.style.margin = "1px"
    removeToyBtn.addEventListener('click', () => {
      removeToy(toy, newCard);
    })

  cardBody.append(cardTitle, cardLikes, cardLikeBtn, removeToyBtn);

  newCard.append(cardImg, cardBody);

  document.getElementById('toy-collection').appendChild(newCard);
  
}

function handleNewToyForm(event) {
  event.preventDefault();
  // console.log(event.target.name.value);
  // console.log(event.target.image.value);

  const newToy = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  }

  // console.log(newToy);

  const reqObj = {
    headers: {'Content-Type': 'application/json'},
    method: "POST",
    body: JSON.stringify(newToy)
  }

  // console.log(reqObj);

  fetch(BASE_URL, reqObj)
    .then(res => res.json())
    .then(renderToy)

  document.getElementById('add-toy-form').reset();
}

function addLike(event) {

  const buttonId = event.target.id
  const toyId = buttonId.split('-')[1];

  let toyLikes = event.target.parentNode.querySelector('.likes').innerText

  let newLikes = {
    likes: +toyLikes + 1
  }

  let reqObj = {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json"
    },
    method: "PATCH",
    body: JSON.stringify(newLikes)
  }

  fetch(BASE_URL+toyId, reqObj)
    .then(res => res.json())
    .then(updatedToy => {
      document.getElementById(`like-${updatedToy.id}`).parentNode.querySelector(".likes").innerText = `${updatedToy.likes}`
    })

}

function removeToy(toy, card) {
  fetch(BASE_URL+toy.id, {method: "DELETE"}).then(() => card.remove()) 
}
