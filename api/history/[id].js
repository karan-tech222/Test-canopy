const db = require('../database');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'ID parameter is required',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'GET') {
      console.log(`[API] GET /api/history/${id}`);
      
      const data = await db.getHistoryById(parseInt(id));
      
      if (!data) {
        return res.status(404).json({
          error: 'Not found',
          message: 'History record not found',
          timestamp: new Date().toISOString()
        });
      }
      
      return res.json({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'DELETE') {
      console.log(`[API] DELETE /api/history/${id}`);
      
      const deleted = await db.deleteHistoryRecord(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Not found',
          message: 'History record not found',
          timestamp: new Date().toISOString()
        });
      }
      
      return res.json({
        success: true,
        message: 'History record deleted successfully',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
