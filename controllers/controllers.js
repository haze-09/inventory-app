import * as db from "../db/queries.js";

export const getTracks = async (req, res) => {
  let tracks = await db.getAllTracks();
  let count = await db.getTotal();
  let artists = await db.getAllArtists();
  let genres = await db.getAllGenres();
  let albums = await db.getAllAlbums();
  res.render("index", {
    tracks: tracks,
    count: count,
    title: "All Tracks",
    notHome: false,
    artists: artists,
    genres: genres,
    albums: albums,
  });
};

export const search = async (req, res) => {
  const searchTerm = req.query.search;
  let tracks = await db.getSearchedTracks(searchTerm);
  let count = await db.getTotal();
  let artists = await db.getAllArtists();
  let genres = await db.getAllGenres();
  let albums = await db.getAllAlbums();

  res.render("index", {
    tracks: tracks,
    count: count,
    title: `Results for "${searchTerm}" `,
    notHome: true,
    artists: artists,
    genres: genres,
    albums: albums,
  });
};

export const filterTracks = async (req, res) => {
  const { type, value } = req.params;

  let count = await db.getTotal();
  let artists = await db.getAllArtists();
  let genres = await db.getAllGenres();
  let albums = await db.getAllAlbums();

  let tracks;

  switch (type) {
    case "artist":
      tracks = await db.getArtist(value);
      res.render("index", {
        tracks: tracks,
        count: count,
        title: value,
        notHome: true,
        artists: artists,
        genres: genres,
        albums: albums,
      });
      break;
    case "album":
      tracks = await db.getAlbum(value);
      res.render("index", {
        tracks: tracks,
        count: count,
        title: value,
        notHome: true,
        artists: artists,
        genres: genres,
        albums: albums,
      });
      break;
    case "genre":
      tracks = await db.getGenre(value);
      res.render("index", {
        tracks: tracks,
        count: count,
        title: value,
        notHome: true,
        artists: artists,
        genres: genres,
        albums: albums,
      });
      break;
    case "year":
      tracks = await db.getYear(value);
      res.render("index", {
        tracks: tracks,
        count: count,
        title: value,
        notHome: true,
        artists: artists,
        genres: genres,
        albums: albums,
      });
      break;

    default:
      break;
  }
};

export const addTrack = async (req, res) => {
  const trackData = {
    trackName: req.body.track.trim(),
    album: req.body.album.trim(),
    year: parseInt(req.body.year),
    albumArt: req.body.albumArtAddress.trim(),
    artists: Array.isArray(req.body.artist)
      ? req.body.artist
      : [req.body.artist],
    genres: Array.isArray(req.body.genre) ? req.body.genre : [req.body.genre],
  };
  console.log(trackData);

  await db.addTrackToDB(trackData);
  res.redirect("/");
};
