const Database = require('better-sqlite3');
const path = require('path');

let db = null;

function getDatabase() {
  if (!db) {
    // For Vercel, use /tmp directory for writable storage
    const dbPath = process.env.VERCEL 
      ? '/tmp/history.db'
      : path.join(__dirname, '..', 'backend', 'data', 'history.db');
    
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS allocation_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      allocation_amount REAL NOT NULL,
      total_allocated REAL NOT NULL,
      investor_count INTEGER NOT NULL,
      utilization_rate REAL NOT NULL,
      input_data TEXT NOT NULL,
      result_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `;
  
  db.exec(createTableSQL);
  db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON allocation_history(created_at DESC)');
}

function saveResult(data) {
  const database = getDatabase();
  const { allocation_amount, input, result, notes = '' } = data;
  
  const totalAllocated = Object.values(result).reduce((sum, val) => sum + val, 0);
  const investorCount = Object.keys(result).length;
  const utilizationRate = (totalAllocated / allocation_amount) * 100;
  
  const insertSQL = `
    INSERT INTO allocation_history (
      allocation_amount,
      total_allocated,
      investor_count,
      utilization_rate,
      input_data,
      result_data,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const stmt = database.prepare(insertSQL);
  const info = stmt.run(
    allocation_amount,
    totalAllocated,
    investorCount,
    utilizationRate,
    JSON.stringify(input),
    JSON.stringify(result),
    notes
  );
  
  return info.lastInsertRowid;
}

function getAllHistory(limit = 100, offset = 0) {
  const database = getDatabase();
  const selectSQL = `
    SELECT 
      id,
      allocation_amount,
      total_allocated,
      investor_count,
      utilization_rate,
      input_data,
      result_data,
      created_at,
      notes
    FROM allocation_history
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  const stmt = database.prepare(selectSQL);
  const rows = stmt.all(limit, offset);
  
  return rows.map(row => ({
    ...row,
    input_data: JSON.parse(row.input_data),
    result_data: JSON.parse(row.result_data)
  }));
}

function getHistoryById(id) {
  const database = getDatabase();
  const selectSQL = `
    SELECT 
      id,
      allocation_amount,
      total_allocated,
      investor_count,
      utilization_rate,
      input_data,
      result_data,
      created_at,
      notes
    FROM allocation_history
    WHERE id = ?
  `;
  
  const stmt = database.prepare(selectSQL);
  const row = stmt.get(id);
  
  if (!row) {
    return null;
  }
  
  return {
    ...row,
    input_data: JSON.parse(row.input_data),
    result_data: JSON.parse(row.result_data)
  };
}

function getTotalCount() {
  const database = getDatabase();
  const stmt = database.prepare('SELECT COUNT(*) as count FROM allocation_history');
  return stmt.get().count;
}

function deleteHistoryRecord(id) {
  const database = getDatabase();
  const stmt = database.prepare('DELETE FROM allocation_history WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

function getRecentHistory(limit = 5) {
  return getAllHistory(limit, 0);
}

function getStatistics() {
  const database = getDatabase();
  const statsSQL = `
    SELECT 
      COUNT(*) as total_calculations,
      AVG(allocation_amount) as avg_allocation_amount,
      AVG(total_allocated) as avg_total_allocated,
      AVG(investor_count) as avg_investor_count,
      AVG(utilization_rate) as avg_utilization_rate,
      MAX(created_at) as last_calculation_date
    FROM allocation_history
  `;
  
  const stmt = database.prepare(statsSQL);
  return stmt.get();
}

module.exports = {
  saveResult,
  getAllHistory,
  getHistoryById,
  getTotalCount,
  deleteHistoryRecord,
  getRecentHistory,
  getStatistics
};
