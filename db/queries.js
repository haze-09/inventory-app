import pool from "./pool.js";

const selectAllTracks = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    a.album_art_url as img,
    a.year as year,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', ar.artist_name,
        'id', ar.artist_id
    )) AS artists,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', g.genre_name,
        'id', g.genre_id
    )) AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
GROUP BY t.track_id, a.album_name, a.album_art_url, a.year
ORDER BY t.track_name; `;

const totalTracks = "SELECT count(*) FROM tracks;";

const selectArtist = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    a.album_art_url as img,
    a.year as year,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', ar.artist_name,
        'id', ar.artist_id
    )) AS artists,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', g.genre_name,
        'id', g.genre_id
    )) AS genres
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
GROUP BY t.track_id, a.album_name, a.album_art_url, a.year
ORDER BY t.track_name; `;

const selectGenre = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    a.album_art_url as img,
    a.year as year,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', ar.artist_name,
        'id', ar.artist_id
    )) AS artists,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', g.genre_name,
        'id', g.genre_id
    )) AS genres
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
GROUP BY t.track_id, a.album_name, a.album_art_url, a.year
ORDER BY t.track_name;`;

const selectYear = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    a.album_art_url as img,
    a.year as year,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', ar.artist_name,
        'id', ar.artist_id
    )) AS artists,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', g.genre_name,
        'id', g.genre_id
    )) AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
WHERE year = $1
GROUP BY t.track_id, a.album_name, a.album_art_url, a.year
ORDER BY t.track_name;`;

const selectAlbum = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    a.album_art_url as img,
    a.year as year,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', ar.artist_name,
        'id', ar.artist_id
    )) AS artists,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', g.genre_name,
        'id', g.genre_id
    )) AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
WHERE album_name = $1
GROUP BY t.track_id, a.album_name, a.album_art_url, a.year
ORDER BY t.track_name;`;

const searchTracks = `
SELECT
    t.track_name AS track,
    a.album_name as album,
    a.album_art_url as img,
    a.year as year,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', ar.artist_name,
        'id', ar.artist_id
    )) AS artists,
    JSON_AGG(DISTINCT jsonb_build_object(
        'name', g.genre_name,
        'id', g.genre_id
    )) AS genres
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
JOIN track_artists ta ON t.track_id = ta.track_id
JOIN artists ar ON ta.artist_id = ar.artist_id
JOIN track_genres tg ON t.track_id = tg.track_id
JOIN genres g ON tg.genre_id = g.genre_id
WHERE 
    t.track_name ILIKE $1 OR
    a.album_name ILIKE $1 OR
    ar.artist_name ILIKE $1 OR
    g.genre_name ILIKE $1 OR
    CAST(a.year AS TEXT) ILIKE $1
GROUP BY t.track_id, a.album_name, a.album_art_url, a.year
ORDER BY t.track_name;`;

const allArtists = `SELECT * FROM artists`;

const allGenres = `SELECT * FROM genres`;

const allAlbums = `SELECT * FROM albums`;

const addTrack = `
WITH new_album AS (
    INSERT INTO albums (album_name, year, album_art_url) 
    VALUES ($1, $2, $3)
    ON CONFLICT (album_name) DO UPDATE
    SET year = EXCLUDED.year,
        album_art_url = EXCLUDED.album_art_url
    RETURNING album_id
),
new_track AS (
    INSERT INTO tracks (track_name, album_id)
    SELECT $4, album_id FROM new_album
    RETURNING track_id
),
artist_ids AS (
    INSERT INTO artists (artist_name)
    SELECT unnest($5::text[])
    ON CONFLICT (artist_name) DO UPDATE
    SET artist_name = EXCLUDED.artist_name
    RETURNING artist_id
),
track_artist_relations AS (
    INSERT INTO track_artists (track_id, artist_id)
    SELECT new_track.track_id, artist_ids.artist_id
    FROM new_track, artist_ids
    ON CONFLICT ON CONSTRAINT track_artists_pkey DO NOTHING
),
genre_ids AS (
    INSERT INTO genres (genre_name)
    SELECT unnest($6::text[])
    ON CONFLICT (genre_name) DO UPDATE
    SET genre_name = EXCLUDED.genre_name
    RETURNING genre_id
)
INSERT INTO track_genres (track_id, genre_id)
SELECT new_track.track_id, genre_ids.genre_id
FROM new_track, genre_ids
ON CONFLICT ON CONSTRAINT track_genres_pkey DO NOTHING;
`;

export async function addTrackToDB(trackData) {
  const { album, year, albumArt, trackName, artists, genres } = trackData;
  await pool.query(addTrack, [
    album,
    year,
    albumArt,
    trackName,
    artists,
    genres,
  ]);
}

export async function getSearchedTracks(query) {
  const searchParam = String(query);
  const { rows } = await pool.query(searchTracks, [String(`%${searchParam}%`)]);
  return rows;
}

export async function getAllTracks() {
  const { rows } = await pool.query(selectAllTracks);
  return rows;
}

export async function getAllArtists() {
  const { rows } = await pool.query(allArtists);
  return rows;
}

export async function getAllGenres() {
  const { rows } = await pool.query(allGenres);
  return rows;
}

export async function getAllAlbums() {
  const { rows } = await pool.query(allAlbums);
  return rows;
}

export async function getTotal() {
  const { rows } = await pool.query(totalTracks);
  return rows[0].count;
}

export async function getArtist(artist) {
  const { rows } = await pool.query(selectArtist, [String(artist)]);
  return rows;
}

export async function getGenre(genre) {
  const { rows } = await pool.query(selectGenre, [String(genre)]);
  return rows;
}

export async function getAlbum(album) {
  const { rows } = await pool.query(selectAlbum, [String(album)]);
  return rows;
}

export async function getYear(year) {
  const { rows } = await pool.query(selectYear, [String(year)]);
  return rows;
}
