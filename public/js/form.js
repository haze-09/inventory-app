const addArtistButton = document.querySelector("#addArtist");
const addGenreButton = document.querySelector("#addGenre");

function attachListener(button, name, placeholder, list) {
    let newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("name", name);
    newInput.setAttribute("placeholder", placeholder);
    newInput.setAttribute("list", list);
    newInput.required = true;
    button.insertAdjacentElement("beforebegin", newInput);
}

addArtistButton.addEventListener("click", () => {
    attachListener(addArtistButton, 'artist', 'Artist', 'artistList');
});

addGenreButton.addEventListener("click", () => {
    attachListener(addGenreButton, 'genre', 'Genre', 'genreList');
});
