import React from 'react'

const ReviewAnalysis = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>1. Count the number of reviews per year.</div>
      <div>2. Count the number of useful (helpful), funny (funny), and cool (cool) reviews.</div>
      <div>3. Rank users by the total number of reviews each year.</div>
      <div>4. Extract the Top 20 most common words from all reviews.</div>
      <div>5. Extract the Top 10 words from positive reviews (rating 3).</div>
      <div>6. Extract the Top 10 words from negative reviews (rating ≤ 3).</div>
      <div>7. Perform word cloud analysis by filtering words based on part-of-speech tagging.</div>
      <div>8. Construct a word association graph (e.g., relations between words like "Chinese" and "steak").</div>
    </div>
  )
}

export default ReviewAnalysis