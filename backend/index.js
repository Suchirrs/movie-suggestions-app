// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// const PORT = 5000; // You can change the port if needed

// // Middleware
// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Spider@123',
//     database: 'imdb_data',
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });


// // Endpoint to execute the query
// app.get('/movies', (req, res) => {
//     const query = `
//         SELECT 
//             d.primaryTitle AS Title, 
//             d.runtimeMinutes, 
//             f.primaryName AS Director,
//             g.averageRating,
//             g.numVotes,
//             d.genres,
//             d.startYear as Year_Made
//         FROM 
//         (SELECT 
//                 tconst, primaryTitle, runtimeMinutes, genres, startYear
//             FROM 
//                 imdb_data.title_basics
//             WHERE 
//                 runtimeMinutes > 60
//         ) AS d
//         JOIN 
//         (SELECT tconst, directors
//         FROM title_crew) 
//         AS e 
//         ON d.tconst = e.tconst
//         JOIN 
//         name_basics f ON e.directors = f.nconst
//         JOIN 
//         title_ratings g ON g.tconst = d.tconst
//         ORDER BY 
//             g.averageRating DESC
//         LIMIT 
//             1000;
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Start Server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000; // You can change the port if needed

// Middleware
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Spider@123',
    database: 'imdb_data',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint to fetch all movies
app.get('/movies', (req, res) => {
    const query = `
        SELECT 
            d.primaryTitle AS Title, 
            d.runtimeMinutes, 
            f.primaryName AS Director,
            g.averageRating,
            g.numVotes,
            d.genres,
            d.startYear AS Year_Made
        FROM 
        (SELECT 
                tconst, primaryTitle, runtimeMinutes, genres, startYear
            FROM 
                imdb_data.title_basics
            WHERE 
                runtimeMinutes > 60
        ) AS d
        JOIN 
        (SELECT tconst, directors
        FROM title_crew) 
        AS e 
        ON d.tconst = e.tconst
        JOIN 
        name_basics f ON e.directors = f.nconst
        JOIN 
        title_ratings g ON g.tconst = d.tconst
        ORDER BY 
            g.averageRating DESC
        LIMIT 
            300;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Endpoint to fetch movies based on genre
app.get('/movies/genre', (req, res) => {
    const genre = req.query.genre;
    if (!genre) {
        return res.status(400).json({ error: 'Genre parameter is required' });
    }

    const query = `
        SELECT 
            d.primaryTitle AS Title, 
            d.runtimeMinutes, 
            f.primaryName AS Director,
            g.averageRating,
            g.numVotes,
            d.genres,
            d.startYear AS Year_Made
        FROM 
        (SELECT 
                tconst, primaryTitle, runtimeMinutes, genres, startYear
            FROM 
                imdb_data.title_basics
            WHERE 
                runtimeMinutes > 60 
                AND genres LIKE CONCAT('%', ?, '%')
        ) AS d
        JOIN 
        (SELECT tconst, directors
        FROM title_crew) 
        AS e 
        ON d.tconst = e.tconst
        JOIN 
        name_basics f ON e.directors = f.nconst
        JOIN 
        title_ratings g ON g.tconst = d.tconst
        ORDER BY 
            g.averageRating DESC
        LIMIT 
            300;
    `;

    db.query(query, [genre], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Endpoint to fetch movies based on director
app.get('/movies/director', (req, res) => {
    const director = req.query.director;
    if (!director) {
        return res.status(400).json({ error: 'Director parameter is required' });
    }

    const query = `
        SELECT 
            d.primaryTitle AS Title, 
            d.runtimeMinutes, 
            f.primaryName AS Director,
            g.averageRating,
            g.numVotes,
            d.genres,
            d.startYear AS Year_Made
        FROM 
        (SELECT 
                tconst, primaryTitle, runtimeMinutes, genres, startYear
            FROM 
                imdb_data.title_basics
            WHERE 
                runtimeMinutes > 60
        ) AS d
        JOIN 
        (SELECT tconst, directors
        FROM title_crew) 
        AS e 
        ON d.tconst = e.tconst
        JOIN 
        name_basics f ON e.directors = f.nconst
        JOIN 
        title_ratings g ON g.tconst = d.tconst
        WHERE 
            f.primaryName = ?
        ORDER BY 
            g.averageRating DESC
        LIMIT 
            300;
    `;

    db.query(query, [director], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
