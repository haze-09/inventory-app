import * as db from "../db/queries.js";

export const getTracks = async (req, res) => {
  let tracks = await db.getAllTracks();
  let count = await db.getTotal();
  console.log(tracks);
  console.log(count);
  res.render("index", { tracks: tracks, count: count, title: "All Tracks", notHome: false });
};

export const filterTracks = async (req, res) => {
  const { type, value } = req.params;

  let count = await db.getTotal();

  let tracks;

  switch (type) {
    case "artist":
      tracks = await db.getArtist(value);
      res.render("index", { tracks: tracks, count: count, title: value, notHome: true });
      break;
    case "album":
      tracks = await db.getAlbum(value);
      res.render("index", { tracks: tracks, count: count, title: value, notHome: true });
      break;
    case "genre":
      tracks = await db.getGenre(value);
      res.render("index", { tracks: tracks, count: count, title: value, notHome: true });
      break;
    case "year":
      tracks = await db.getYear(value);
      res.render("index", { tracks: tracks, count: count, title: value, notHome: true });
      break;

    default:
      break;
  }
};
