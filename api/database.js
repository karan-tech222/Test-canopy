const { kv } = require('@vercel/kv');

// In-memory fallback for local development
let memoryStore = [];
let nextId = 1;

const isVercel = process.env.VERCEL || process.env.KV_REST_API_URL;

async function saveResult(data) {
  const { allocation_amount, input, result, notes = '' } = data;
  
  const totalAllocated = Object.values(result).reduce((sum, val) => sum + val, 0);
  const investorCount = Object.keys(result).length;
  const utilizationRate = (totalAllocated / allocation_amount) * 100;
  
  const record = {
    id: nextId++,
    allocation_amount,
    total_allocated: totalAllocated,
    investor_count: investorCount,
    utilization_rate: utilizationRate,
    input_data: input,
    result_data: result,
    created_at: new Date().toISOString(),
    notes
  };
  
  if (isVercel) {
    try {
      await kv.zadd('history:ids', { score: Date.now(), member: record.id });
      await kv.set(`history:${record.id}`, JSON.stringify(record));
      return record.id;
    } catch (error) {
      console.error('KV error, using memory:', error);
      memoryStore.push(record);
      return record.id;
    }
  } else {
    memoryStore.push(record);
    return record.id;
  }
}

async function getAllHistory(limit = 100, offset = 0) {
  if (isVercel) {
    try {
      const ids = await kv.zrange('history:ids', 0, -1, { rev: true });
      const records = [];
      
      for (let i = offset; i < Math.min(offset + limit, ids.length); i++) {
        const data = await kv.get(`history:${ids[i]}`);
        if (data) {
          records.push(typeof data === 'string' ? JSON.parse(data) : data);
        }
      }
      
      return records;
    } catch (error) {
      console.error('KV error, using memory:', error);
      return memoryStore.slice(offset, offset + limit).reverse();
    }
  } else {
    return memoryStore.slice(offset, offset + limit).reverse();
  }
}

async function getHistoryById(id) {
  if (isVercel) {
    try {
      const data = await kv.get(`history:${id}`);
      if (!data) return null;
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      console.error('KV error, using memory:', error);
      return memoryStore.find(r => r.id === id) || null;
    }
  } else {
    return memoryStore.find(r => r.id === id) || null;
  }
}

async function getTotalCount() {
  if (isVercel) {
    try {
      return await kv.zcard('history:ids');
    } catch (error) {
      console.error('KV error, using memory:', error);
      return memoryStore.length;
    }
  } else {
    return memoryStore.length;
  }
}

async function deleteHistoryRecord(id) {
  if (isVercel) {
    try {
      await kv.zrem('history:ids', id);
      await kv.del(`history:${id}`);
      return true;
    } catch (error) {
      console.error('KV error, using memory:', error);
      const index = memoryStore.findIndex(r => r.id === id);
      if (index > -1) {
        memoryStore.splice(index, 1);
        return true;
      }
      return false;
    }
  } else {
    const index = memoryStore.findIndex(r => r.id === id);
    if (index > -1) {
      memoryStore.splice(index, 1);
      return true;
    }
    return false;
  }
}

async function getRecentHistory(limit = 5) {
  return await getAllHistory(limit, 0);
}

async function getStatistics() {
  const allHistory = await getAllHistory(1000, 0);
  
  if (allHistory.length === 0) {
    return {
      total_calculations: 0,
      avg_allocation_amount: 0,
      avg_total_allocated: 0,
      avg_investor_count: 0,
      avg_utilization_rate: 0,
      last_calculation_date: null
    };
  }
  
  const total = allHistory.length;
  const sum = allHistory.reduce((acc, record) => ({
    allocation_amount: acc.allocation_amount + record.allocation_amount,
    total_allocated: acc.total_allocated + record.total_allocated,
    investor_count: acc.investor_count + record.investor_count,
    utilization_rate: acc.utilization_rate + record.utilization_rate
  }), { allocation_amount: 0, total_allocated: 0, investor_count: 0, utilization_rate: 0 });
  
  return {
    total_calculations: total,
    avg_allocation_amount: sum.allocation_amount / total,
    avg_total_allocated: sum.total_allocated / total,
    avg_investor_count: Math.round(sum.investor_count / total),
    avg_utilization_rate: sum.utilization_rate / total,
    last_calculation_date: allHistory[0]?.created_at || null
  };
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
