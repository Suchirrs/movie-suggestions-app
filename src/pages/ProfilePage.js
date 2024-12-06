import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const userId = "Test"; // Replace this with actual dynamic userId

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const topDirectorsResponse = await fetch(`http://localhost:5000/profile/top-directors/${userId}`);
                const topGenresResponse = await fetch(`http://localhost:5000/profile/top-genres/${userId}`);
                const totalRatingsResponse = await fetch(`http://localhost:5000/profile/total-ratings/${userId}`);

                const topDirectors = await topDirectorsResponse.json();
                const topGenres = await topGenresResponse.json();
                const totalRatings = await totalRatingsResponse.json();

                setUserProfile({
                    topDirectors,
                    topGenres,
                    totalRatings: totalRatings.totalRatings,
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, [userId]);

    const styles = {
        pageContainer: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#212121',
            color: 'white',
            overflow: 'auto', // Added to enable scrolling
        },
        mainContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto', // Centering the content
        },
        heading: {
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
        },
        section: {
            marginBottom: '20px',
            textAlign: 'left',
            width: '100%',
            maxWidth: '600px',
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: 'normal',
            color: '#d32f2f',
            marginBottom: '10px'
        },
        list: {
            listStyleType: 'none',
            padding: '0'
        },
        listItem: {
            fontSize: '18px',
            marginBottom: '8px',
            color: 'white'
        },
        signOutButton: {
            backgroundColor: '#d32f2f',
            color: 'white',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '30px'
        },
        description: {
            fontSize: '18px',
            color: 'white'
        }
    };

    return (
        <div style={styles.pageContainer}>
            <TopBar />
            <div style={styles.mainContent}>
                <h2 style={styles.heading}>Your Profile</h2>
                {userProfile ? (
                    <>
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Your Top Movie Categories</h3>
                            <ul style={styles.list}>
                                {userProfile.topGenres.map((genre, index) => (
                                    <li key={index} style={styles.listItem}>
                                        {genre.name}
                                        <div style={{ fontSize: 'smaller', marginTop: '4px' }}>
                                            Average rating: {Math.round(genre.average * 100) / 100}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Your Top Directors</h3>
                            <ul style={styles.list}>
                                {userProfile.topDirectors.map((director, index) => (
                                    <li key={index} style={styles.listItem}>
                                        {director.name}
                                        <div style={{ fontSize: 'smaller', marginTop: '4px' }}>
                                            Average rating: {Math.round(director.average * 100) / 100}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={styles.section}>
                            <p style={styles.description}>
                                Your suggestions are based on {userProfile.totalRatings} ratings.
                            </p>
                        </div>
                    </>
                ) : (
                    <p>Loading profile...</p>
                )}
                <button 
                    onClick={() => navigate("/")} 
                    style={styles.signOutButton}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
