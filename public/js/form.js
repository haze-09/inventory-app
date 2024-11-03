const addArtistButton = document.querySelector("#addArtist");
const addGenreButton = document.querySelector("#addGenre");

function addInput(button, name, placeholder, list) {
  let newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", name);
  newInput.setAttribute("placeholder", placeholder);
  newInput.setAttribute("list", list);
  newInput.required = true;
  button.insertAdjacentElement("beforebegin", newInput);
}

function deleteInput(container) {
  const inputs = document.querySelectorAll(`#${container} > input`);
  const deleteBtn = document.querySelector(`.${container}-delete-btn`);

  if (inputs.length > 1) {
    if (!deleteBtn) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `${container}-delete-btn`;
      btn.innerHTML = '<i class="fa-solid fa-minus"></i>';

      btn.addEventListener("click", () => {
        let inputs = document.querySelectorAll(`#${container} > input`);

        if(inputs.length == 2){
            document.querySelector(`.${container}-delete-btn`).remove();
        }
        
        inputs[inputs.length - 1].remove();
      });

      document.querySelector(`#${container}`).appendChild(btn);
    }
  } else if (deleteBtn) {
    deleteBtn.remove();
  }
}

addArtistButton.addEventListener("click", () => {
  addInput(addArtistButton, "artist", "Artist", "artistList");
  deleteInput("artistInputs");
});

addGenreButton.addEventListener("click", () => {
  addInput(addGenreButton, "genre", "Genre", "genreList");
  deleteInput("genreInputs");
});
