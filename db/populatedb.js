import "dotenv/config";
import pg from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS artists (
    artist_id SERIAL PRIMARY KEY,
    artist_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS albums (
    album_id SERIAL PRIMARY KEY,
    album_name VARCHAR(255) NOT NULL UNIQUE,
    year INTEGER CHECK (year BETWEEN 1000 AND 9999),
    album_art_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS genres (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tracks (
    track_id SERIAL PRIMARY KEY,
    track_name VARCHAR(255) NOT NULL,
    album_id INT,
    FOREIGN KEY (album_id) REFERENCES albums(album_id)
);

CREATE TABLE IF NOT EXISTS track_artists (
    track_id INT,
    artist_id INT,
    PRIMARY KEY (track_id, artist_id),
    FOREIGN KEY (track_id) REFERENCES tracks(track_id), 
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE IF NOT EXISTS track_genres (
    track_id INT,
    genre_id INT,
    PRIMARY KEY (track_id, genre_id),
    FOREIGN KEY (track_id) REFERENCES tracks(track_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

-- Insert initial data into the tables
INSERT INTO artists (artist_name) VALUES
    ('Tyler the Creator'),
    ('JPEGMAFIA'),
    ('Parannoul'),
    ('Danny Brown'),
    ('Denzel Curry');

INSERT INTO albums (album_name, year, album_art_url) VALUES
    ('Call Me If You Get Lost', 2021, 'https://upload.wikimedia.org/wikipedia/en/d/d3/Call_Me_If_You_Get_Lost_album_cover.jpg'),
    ('I Lay Down My Life for You', 2024, 'https://upload.wikimedia.org/wikipedia/en/b/b3/JPEGMafia_-_I_Lay_Down_My_Life_for_You.png'),
    ('To See the Next Part of the Dream', 2021, 'https://upload.wikimedia.org/wikipedia/en/8/8a/Parannoul_To_See_the_Next_Part_of_the_Dream_cover.png'),
    ('Scaring the Hoes', 2023, 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Scaring_the_Hoes.webp/316px-Scaring_the_Hoes.webp.png');

INSERT INTO genres (genre_name) VALUES
    ('Hip-Hop'),
    ('Shoegaze'),
    ('Alternative'),
    ('Rock'),
    ('Indie');

INSERT INTO tracks (track_name, album_id) VALUES 
    ('MASSA', 1),
    ('JPEGULTRA!(feat. Denzel Curry)', 2),
    ('Beautiful World', 3),
    ('Analog Sentimentalism', 3),
    ('Lean Beef Patty', 4),
    ('Steppa Pig', 4);

INSERT INTO track_artists (track_id, artist_id) VALUES
    (1, 1),
    (2, 2), (2, 5),
    (3, 3),
    (4, 3),
    (5, 2), (5, 4),
    (6, 2), (6, 4);

INSERT INTO track_genres (track_id, genre_id) VALUES
    (1, 1), (1, 3),
    (2, 1), (2, 3),
    (3, 2), (3, 3), (3, 4), (3, 5),
    (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 3),
    (6, 1), (6, 3);
`;

async function main() {
  console.log("seeding...");
  const client = new pg.Client({
    connectionString: process.env.EXTERNAL_DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Done");
  } catch (err) {
    console.error("Error Seeding the DB", err);
  } finally {
    await client.end();
  }
}

main();
