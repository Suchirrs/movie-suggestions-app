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

// // Fetch all movies (existing endpoint)
// app.get('/movies', (req, res) => {
//     const query = `
//         SELECT 
//             d.primaryTitle AS Title, 
//             d.runtimeMinutes, 
//             f.primaryName AS Director,
//             g.averageRating,
//             g.numVotes,
//             d.genres,
//             d.startYear AS Year_Made,
//             d.tconst
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
//             300;
//     `;
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Fetch movies by genre (new endpoint)
// app.get('/movies/genre', (req, res) => {
//     const { genre } = req.query;
//     const query = `
//         SELECT 
//             d.primaryTitle AS Title, 
//             d.runtimeMinutes, 
//             f.primaryName AS Director,
//             g.averageRating,
//             g.numVotes,
//             d.genres,
//             d.startYear AS Year_Made,
//             d.tconst
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
//         WHERE 
//             d.genres LIKE ?
//         ORDER BY 
//             g.averageRating DESC;
//     `;
//     db.query(query, [`%${genre}%`], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Fetch movies by director (new endpoint)
// app.get('/movies/director', (req, res) => {
//     const { director } = req.query;
//     const query = `
//         SELECT 
//             d.primaryTitle AS Title, 
//             d.runtimeMinutes, 
//             f.primaryName AS Director,
//             g.averageRating,
//             g.numVotes,
//             d.genres,
//             d.startYear AS Year_Made,
//             d.tconst
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
//         WHERE 
//             f.primaryName LIKE ?
//         ORDER BY 
//             g.averageRating DESC;
//     `;
//     db.query(query, [`%${director}%`], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Fetch user recommendations 
// app.get('/suggestions/:userid', (req, res) => {
//     const userId = req.params.userid;
//     const query = `
//         WITH similarityMetic AS (
//             SELECT 
//                 u1.userid AS target_user,
//                 u2.userid AS similar_user,
//                 AVG(u1.rating * u2.rating) AS similarity
//             FROM user_reviews u1
//             JOIN user_reviews u2 ON u1.tconst = u2.tconst
//             WHERE u1.userid != u2.userid
//                   AND u1.userid = ?
//             GROUP BY u1.userid, u2.userid
//         ),
//         similarUsers AS (
//             SELECT similar_user, similarity
//             FROM similarityMetic
//             ORDER BY similarity DESC
//         ),
//         myReviews AS (
//             SELECT tconst
//             FROM user_reviews
//             WHERE userid = ?
//         )
//         SELECT 
//             tb.primaryTitle AS title,
//             tb.startYear as Year,
//             nb.primaryName,
//             tb.genres,
//             tr.averageRating
//         FROM user_reviews r
//         JOIN similarUsers su ON r.userid = su.similar_user
//         LEFT JOIN myReviews mr ON r.tconst = mr.tconst
//         JOIN title_basics tb ON r.tconst = tb.tconst 
//         JOIN title_ratings tr ON r.tconst = tr.tconst 
//         JOIN title_crew tc ON r.tconst = tc.tconst
//         JOIN name_basics nb on tc.directors = nb.nconst
//         WHERE mr.tconst IS NULL 
//         GROUP BY r.tconst, tb.primaryTitle, tb.startYear, tb.genres, tr.averageRating
//         ORDER BY tr.averageRating DESC;
//     `;
    
//     db.query(query, [userId, userId], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Endpoint to fetch top 3 directors
// app.get('/profile/top-directors/:userid', (req, res) => {
//     const userId = req.params.userid;

//     const query = `
//         SELECT Director AS name, COUNT(Director) AS count, AVG(rating) AS average
//         FROM (
//             SELECT tb.primaryTitle AS Title, nb.primaryName AS Director, tb.genres, ur.rating
//             FROM user_reviews ur
//             JOIN title_basics tb ON ur.tconst = tb.tconst
//             JOIN title_crew tc ON tb.tconst = tc.tconst
//             JOIN name_basics nb ON tc.directors = nb.nconst
//             WHERE ur.userid = ?
//         ) AS sub
//         GROUP BY Director
//         ORDER BY (LOG(COUNT(Director) + 1) * AVG(rating)) DESC
//         LIMIT 3
//     `;

//     db.query(query, [userId], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Endpoint to fetch top 3 genres
// app.get('/profile/top-genres/:userid', (req, res) => {
//     const userId = req.params.userid;

//     const query = `
//         SELECT genres AS name, COUNT(genres) AS count, AVG(rating) AS average
//         FROM (
//             SELECT tb.primaryTitle AS Title, nb.primaryName AS Director, tb.genres, ur.rating
//             FROM user_reviews ur
//             JOIN title_basics tb ON ur.tconst = tb.tconst
//             JOIN title_crew tc ON tb.tconst = tc.tconst
//             JOIN name_basics nb ON tc.directors = nb.nconst
//             WHERE ur.userid = ?
//         ) AS sub
//         GROUP BY genres
//         ORDER BY (LOG(COUNT(genres) + 1) * AVG(rating)) DESC
//         LIMIT 3
//     `;

//     db.query(query, [userId], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });

// // Endpoint to fetch total ratings
// app.get('/profile/total-ratings/:userid', (req, res) => {
//     const userId = req.params.userid;

//     const query = `
//         SELECT COUNT(userid) AS count
//         FROM user_reviews
//         WHERE userid = ?
//         GROUP BY userid;
//     `;

//     db.query(query, [userId], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json({ totalRatings: results[0]?.count || 0 });
//     });
// });

// // Search movies by title
// app.get('/movies/search', (req, res) => {
//     const { query } = req.query;
//     const searchQuery = `
//         SELECT 
//             tb.primaryTitle AS Title, 
//             nb.primaryName AS Director, 
//             tb.genres,
//             tr.averageRating
//         FROM 
//             title_basics tb
//         JOIN title_crew tc ON tb.tconst = tc.tconst
//         JOIN name_basics nb ON tc.directors = nb.nconst
//         JOIN title_ratings tr ON tb.tconst = tr.tconst 
//         WHERE 
//             tb.titleType = "movie" 
//             AND tb.primaryTitle LIKE ?
//     `;
//     db.query(searchQuery, [`%${query}%`], (err, results) => {
//         if (err) {
//             console.error('Error executing search query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results);
//     });
// });


// // Submit a movie rating (existing endpoint)
// app.post('/ratings', (req, res) => {
//     const { tconst, userid, rating } = req.body;

//     if (!tconst || !userid || rating === undefined) {
//         return res.status(400).json({ error: 'Missing tconst, userid, or rating' });
//     }

//     const query = `
//         INSERT INTO user_reviews (tconst, userid, rating)
//         VALUES (?, ?, ?)
//         ON DUPLICATE KEY UPDATE rating = ?;
//     `;

//     db.query(query, [tconst, userid, rating, rating], (err, result) => {
//         if (err) {
//             console.error('Error inserting rating:', err);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.json({ success: true, message: 'Rating submitted successfully' });
//     });
// });

// // Start Server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cache = require('memory-cache');  // Import memory-cache for in-memory caching

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
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

// Function to get or cache data
async function getCachedOrQuery(cacheKey, queryFn) {
    const cachedData = cache.get(cacheKey);  // Check cache
    if (cachedData) {
        return JSON.parse(cachedData);  // Return cached data
    }
    const results = await queryFn();  // Execute query if not cached
    cache.put(cacheKey, JSON.stringify(results));  // Store results in cache
    return results;
}

// 1. Fetch all movies
app.get('/movies', async (req, res) => {
    const query = `
        SELECT 
            d.primaryTitle AS Title, 
            d.runtimeMinutes, 
            f.primaryName AS Director,
            g.averageRating,
            g.numVotes,
            d.genres,
            d.startYear AS Year_Made,
            d.tconst
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
    try {
        const results = await getCachedOrQuery('allMovies', () => {
            return new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                    if (err) {
                        reject('Error executing query');
                    } else {
                        resolve(results);
                    }
                });
            });
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Database query error' });
    }
});

// 2. Fetch movies by genre
app.get('/movies/genre', async (req, res) => {
    const { genre } = req.query;
    const query = `
        SELECT 
            d.primaryTitle AS Title, 
            d.runtimeMinutes, 
            f.primaryName AS Director,
            g.averageRating,
            g.numVotes,
            d.genres,
            d.startYear AS Year_Made,
            d.tconst
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
            d.genres LIKE ?
        ORDER BY 
            g.averageRating DESC;
    `;
    try {
        const results = await getCachedOrQuery(`genre_${genre}`, () => {
            return new Promise((resolve, reject) => {
                db.query(query, [`%${genre}%`], (err, results) => {
                    if (err) {
                        reject('Error executing query');
                    } else {
                        resolve(results);
                    }
                });
            });
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Database query error' });
    }
});

// 3. Fetch movies by director
app.get('/movies/director', async (req, res) => {
    const { director } = req.query;
    const query = `
        SELECT 
            d.primaryTitle AS Title, 
            d.runtimeMinutes, 
            f.primaryName AS Director,
            g.averageRating,
            g.numVotes,
            d.genres,
            d.startYear AS Year_Made,
            d.tconst
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
            f.primaryName LIKE ?
        ORDER BY 
            g.averageRating DESC;
    `;
    try {
        const results = await getCachedOrQuery(`director_${director}`, () => {
            return new Promise((resolve, reject) => {
                db.query(query, [`%${director}%`], (err, results) => {
                    if (err) {
                        reject('Error executing query');
                    } else {
                        resolve(results);
                    }
                });
            });
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Database query error' });
    }
});

// 4. Fetch user recommendations 
app.get('/suggestions/:userid', async (req, res) => {
    const userId = req.params.userid;
    const query = `
        WITH similarityMetic AS (
            SELECT 
                u1.userid AS target_user,
                u2.userid AS similar_user,
                AVG(u1.rating * u2.rating) AS similarity
            FROM user_reviews u1
            JOIN user_reviews u2 ON u1.tconst = u2.tconst
            WHERE u1.userid != u2.userid
                  AND u1.userid = ?
            GROUP BY u1.userid, u2.userid
        ),
        similarUsers AS (
            SELECT similar_user, similarity
            FROM similarityMetic
            ORDER BY similarity DESC
        ),
        myReviews AS (
            SELECT tconst
            FROM user_reviews
            WHERE userid = ?
        )
        SELECT 
            tb.primaryTitle AS title,
            tb.startYear as Year,
            nb.primaryName,
            tb.genres,
            tr.averageRating
        FROM user_reviews r
        JOIN similarUsers su ON r.userid = su.similar_user
        LEFT JOIN myReviews mr ON r.tconst = mr.tconst
        JOIN title_basics tb ON r.tconst = tb.tconst 
        JOIN title_ratings tr ON r.tconst = tr.tconst 
        JOIN title_crew tc ON r.tconst = tc.tconst
        JOIN name_basics nb on tc.directors = nb.nconst
        WHERE mr.tconst IS NULL 
        GROUP BY r.tconst, tb.primaryTitle, tb.startYear, tb.genres, tr.averageRating
        ORDER BY tr.averageRating DESC;
    `;
    try {
        const results = await getCachedOrQuery(`suggestions_${userId}`, () => {
            return new Promise((resolve, reject) => {
                db.query(query, [userId, userId], (err, results) => {
                    if (err) {
                        reject('Error executing query');
                    } else {
                        resolve(results);
                    }
                });
            });
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Database query error' });
    }
});

// 5. Search movies by title
app.get('/movies/search', async (req, res) => {
    const { query } = req.query;
    const searchQuery = `
        SELECT 
            tb.primaryTitle AS Title, 
            nb.primaryName AS Director, 
            tb.genres,
            tr.averageRating
        FROM 
            title_basics tb
        JOIN title_crew tc ON tb.tconst = tc.tconst
        JOIN name_basics nb ON tc.directors = nb.nconst
        JOIN title_ratings tr ON tb.tconst = tr.tconst 
        WHERE 
            tb.titleType = "movie" 
            AND tb.primaryTitle LIKE ?
    `;
    try {
        const results = await getCachedOrQuery(`search_${query}`, () => {
            return new Promise((resolve, reject) => {
                db.query(searchQuery, [`%${query}%`], (err, results) => {
                    if (err) {
                        reject('Error executing query');
                    } else {
                        resolve(results);
                    }
                });
            });
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Database query error' });
    }
});

// 6. Fetch total ratings of a user
app.get('/profile/total-ratings/:userid', (req, res) => {
    const userId = req.params.userid;
    const query = `
        SELECT COUNT(userid) AS count
        FROM user_reviews
        WHERE userid = ?;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json({ totalRatings: results[0]?.count || 0 });
    });
});

// 7. Fetch top 3 directors
app.get('/profile/top-directors/:userid', (req, res) => {
    const userId = req.params.userid;
    const query = `
        SELECT Director AS name, COUNT(Director) AS count, AVG(rating) AS average
        FROM (
            SELECT tb.primaryTitle AS Title, nb.primaryName AS Director, tb.genres, ur.rating
            FROM user_reviews ur
            JOIN title_basics tb ON ur.tconst = tb.tconst
            JOIN title_crew tc ON tb.tconst = tc.tconst
            JOIN name_basics nb ON tc.directors = nb.nconst
            WHERE ur.userid = ?
        ) AS sub
        GROUP BY Director
        ORDER BY (LOG(COUNT(Director) + 1) * AVG(rating)) DESC
        LIMIT 3
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// 8. Fetch top 3 genres
app.get('/profile/top-genres/:userid', (req, res) => {
    const userId = req.params.userid;
    const query = `
        SELECT genres AS name, COUNT(genres) AS count, AVG(rating) AS average
        FROM (
            SELECT tb.primaryTitle AS Title, nb.primaryName AS Director, tb.genres, ur.rating
            FROM user_reviews ur
            JOIN title_basics tb ON ur.tconst = tb.tconst
            JOIN title_crew tc ON tb.tconst = tc.tconst
            JOIN name_basics nb ON tc.directors = nb.nconst
            WHERE ur.userid = ?
        ) AS sub
        GROUP BY genres
        ORDER BY (LOG(COUNT(genres) + 1) * AVG(rating)) DESC
        LIMIT 3
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// // 9. POST rating for a movie
// app.post('/ratings', (req, res) => {
//     const { userId, tconst, rating } = req.body;
//     const query = `
//         INSERT INTO user_reviews (userid, tconst, rating)
//         VALUES (?, ?, ?)
//         ON DUPLICATE KEY UPDATE rating = ?;
//     `;
//     db.query(query, [userId, tconst, rating, rating], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json({ message: 'Rating submitted successfully' });
//     });
// });
// Submit a movie rating (existing endpoint)
app.post('/ratings', (req, res) => {
    const { tconst, userid, rating } = req.body;

    if (!tconst || !userid || rating === undefined) {
        return res.status(400).json({ error: 'Missing tconst, userid, or rating' });
    }

    const query = `
        INSERT INTO user_reviews (tconst, userid, rating)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = ?;
    `;

    db.query(query, [tconst, userid, rating, rating], (err, result) => {
        if (err) {
            console.error('Error inserting rating:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, message: 'Rating submitted successfully' });
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
