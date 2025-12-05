const db = require('../../database');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] GET /api/dashboard/stats');
    
    const stats = db.getStatistics();
    const recentHistory = db.getRecentHistory(5);
    
    return res.json({
      success: true,
      data: {
        statistics: {
          total_calculations: stats.total_calculations || 0,
          avg_allocation_amount: stats.avg_allocation_amount || 0,
          avg_total_allocated: stats.avg_total_allocated || 0,
          avg_investor_count: Math.round(stats.avg_investor_count || 0),
          avg_utilization_rate: stats.avg_utilization_rate || 0,
          last_calculation_date: stats.last_calculation_date || null
        },
        recent_calculations: recentHistory
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
