// SELECT
//     t.track_name AS track,
//     a.album_name as album,
//     string_agg(DISTINCT ar.artist_name, ', ') AS artists,
//     string_agg(DISTINCT g.genre_name, ', ') AS genres
// FROM tracks t
// JOIN albums a ON t.album_id = a.album_id
// JOIN track_artists ta ON t.track_id = ta.track_id
// JOIN artists ar ON ta.artist_id = ar.artist_id
// JOIN track_genres tg ON t.track_id = tg.track_id
// JOIN genres g ON tg.genre_id = g.genre_id
// GROUP BY t.track_id, a.album_name
// ORDER BY t.track_name;