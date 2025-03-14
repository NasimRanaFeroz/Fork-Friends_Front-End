import React from 'react'

const UserAnalysis = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>1. Analyze the number of users joining each year.</div>
      <div>2. Identify top reviewers based on review_count.</div>
      <div>3. Identify the most popular users based on fans.</div>
      <div>4. Calculate the ratio of elite users to regular users each year.</div>
      <div>5. Display the proportion of total users and silent users (users who haven't written reviews) each year.</div>
      <div>6. Compute the yearly statistics of new users, number of reviews, elite users, tips, and check-ins.</div>
    </div>
  )
}

export default UserAnalysis