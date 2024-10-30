import pool from "./pool.js";

const selectAllTracks =`
SELECT
    t.track_name AS track,
    a.album_name as album,
    string_agg(DISTINCT ar.artist_name, ', ') AS artists,
    string_agg(DISTINCT g.genre_name, ', ') AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
GROUP BY t.track_id, a.album_name
ORDER BY t.track_name; `;


const selectArtist = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    string_agg(DISTINCT ar.artist_name, ', ') AS artists,
    string_agg(DISTINCT g.genre_name, ', ') AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
WHERE t.track_id IN (
    SELECT t2.track_id
    FROM tracks t2
    JOIN track_artists ta2 ON t2.track_id = ta2.track_id
    JOIN artists ar2 ON ta2.artist_id = ar2.artist_id
    WHERE ar2.artist_name = $1
)
GROUP BY t.track_id,a.album_name
ORDER BY t.track_name; `;


const selectGenre = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    string_agg(DISTINCT ar.artist_name, ', ') AS artists,
    string_agg(DISTINCT g.genre_name, ', ') AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
WHERE t.track_id IN (
    SELECT t2.track_id
    FROM tracks t2
    JOIN track_genres tg2 ON t2.track_id = tg2.track_id
    JOIN genres g2 ON tg2.genre_id = g2.genre_id
    WHERE g2.genre_name = $1
)
GROUP BY t.track_id,a.album_name
ORDER BY t.track_name;`;


const selectAlbum = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    string_agg(DISTINCT ar.artist_name, ', ') AS artists,
    string_agg(DISTINCT g.genre_name, ', ') AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
WHERE album_name = $1
GROUP BY t.track_id, a.album_name
ORDER BY t.track_name;`;

export async function getAllTracks(){
    const {rows} = await pool.query(selectAllTracks);
    return rows;
}

export async function getArtist(artist) {
    const {rows} = await pool.query(selectArtist,[String(artist)]);
    return rows;    
}

export async function getGenre(genre) {
    const {rows} = await pool.query(selectGenre,[String(genre)]);
    return rows;    
}

export async function getAlbum(album) {
    const {rows} = await pool.query(selectAlbum,[String(album)]);
    return rows;    
}