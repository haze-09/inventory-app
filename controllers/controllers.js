import * as db from "../db/queries.js";

export const getTracks = async (req, res) => {
  let tracks = await db.getAllTracks();
  let count = await db.getTotal();
  console.log(tracks);
  console.log(count);
  res.render("index", { tracks: tracks, count: count, title: 'All Tracks' });
};
