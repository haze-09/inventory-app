import * as db from '../db/queries.js'

export const getTracks = async (req,res)=>{
    let tracks = await db.getAllTracks();
    console.log(tracks);
    res.render("index",{tracks: tracks});
}