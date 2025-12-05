const { prorate } = require('./proration');
const db = require('./database');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] POST /api/prorate');
    
    const input = req.body;
    const notes = req.body.notes || '';
    
    const result = prorate(input);
    
    if (result.error) {
      console.error('[API] Proration failed:', result.error);
      return res.status(400).json({
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
    
    try {
      const historyId = db.saveResult({
        allocation_amount: input.allocation_amount,
        input: input,
        result: result,
        notes: notes
      });
      console.log(`[API] Saved to history with ID: ${historyId}`);
      
      return res.json({
        success: true,
        data: result,
        historyId: historyId,
        timestamp: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('[API] Failed to save history:', dbError.message);

      return res.json({
        success: true,
        data: result,
        warning: 'Result calculated but not saved to history',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('[API] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};
