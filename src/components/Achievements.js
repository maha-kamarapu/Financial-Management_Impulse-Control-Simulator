import React, { useEffect, useState } from "react";
import { fetchAchievements } from "../services/authService";

const Achievements = ({ token }) => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const getAchievements = async () => {
      const data = await fetchAchievements(token);
      setAchievements(data);
    };

    getAchievements();
  }, [token]);

  return (
    <div className="achievements-container">
      <h3>Your Achievements</h3>
      {achievements.length === 0 ? (
        <p>No achievements yet. Start working on your goals!</p>
      ) : (
        <ul>
          {achievements.map((achievement) => (
            <li key={achievement.id}>
              <strong>{achievement.title}</strong> - {achievement.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Achievements;

