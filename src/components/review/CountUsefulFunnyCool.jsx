export const countUsefulFunnyCoolReviews = async (req, res) => {
  try {
      const db = req.app.locals.db;
      
      // Aggregate to count reviews where useful, funny, or cool values are greater than 0
      const result = await db.collection('review').aggregate([
          {
              $facet: {
                  "useful": [
                      { $match: { useful: { $gt: 0 } } },
                      { $count: "count" }
                  ],
                  "funny": [
                      { $match: { funny: { $gt: 0 } } },
                      { $count: "count" }
                  ],
                  "cool": [
                      { $match: { cool: { $gt: 0 } } },
                      { $count: "count" }
                  ]
              }
          },
          {
              $project: {
                  useful: { $arrayElemAt: ["$useful.count", 0] },
                  funny: { $arrayElemAt: ["$funny.count", 0] },
                  cool: { $arrayElemAt: ["$cool.count", 0] }
              }
          }
      ]).toArray();

      // Handle potential null values in the result
      const formattedResult = {
          useful: result[0].useful || 0,
          funny: result[0].funny || 0,
          cool: result[0].cool || 0
      };

      res.status(200).json(formattedResult);
  } catch (error) {
      console.error('Error counting useful, funny, and cool reviews:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export default countUsefulFunnyCoolReviews;