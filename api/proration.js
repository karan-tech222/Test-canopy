/**
 * Allocation Proration Algorithm
 * 
 * This algorithm distributes limited allocation among investors based on their
 * historical average investment amounts while respecting requested amounts.
 */

class Logger {
  constructor(enabled = process.env.NODE_ENV !== 'production') {
    this.enabled = enabled;
  }

  info(message, data = null) {
    if (this.enabled) {
      console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  debug(message, data = null) {
    if (this.enabled) {
      console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  error(message, error = null) {
    console.error(`[ERROR] ${message}`, error || '');
  }

  warn(message, data = null) {
    if (this.enabled) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
}

const logger = new Logger();

function validateInput(input) {
  logger.debug('Validating input data');

  if (!input || typeof input !== 'object') {
    return { isValid: false, error: 'Input must be an object' };
  }

  if (typeof input.allocation_amount !== 'number' || input.allocation_amount < 0) {
    return { isValid: false, error: 'allocation_amount must be a non-negative number' };
  }

  if (!Array.isArray(input.investor_amounts)) {
    return { isValid: false, error: 'investor_amounts must be an array' };
  }

  if (input.investor_amounts.length === 0) {
    return { isValid: false, error: 'investor_amounts cannot be empty' };
  }

  for (let i = 0; i < input.investor_amounts.length; i++) {
    const investor = input.investor_amounts[i];
    
    if (!investor.name || typeof investor.name !== 'string') {
      return { isValid: false, error: `Investor at index ${i} must have a valid name` };
    }

    if (typeof investor.requested_amount !== 'number' || investor.requested_amount < 0) {
      return { isValid: false, error: `${investor.name}: requested_amount must be a non-negative number` };
    }

    if (typeof investor.average_amount !== 'number' || investor.average_amount < 0) {
      return { isValid: false, error: `${investor.name}: average_amount must be a non-negative number` };
    }
  }

  logger.info('Input validation passed');
  return { isValid: true };
}

function calculateProration(allocationAmount, investors) {
  logger.info('Starting proration calculation', {
    allocation: allocationAmount,
    investorCount: investors.length
  });

  if (allocationAmount === 0 || investors.length === 0) {
    const result = {};
    investors.forEach(inv => result[inv.name] = 0);
    logger.info('Zero allocation scenario', result);
    return result;
  }

  const totalRequested = investors.reduce((sum, inv) => sum + inv.requested_amount, 0);
  
  if (allocationAmount >= totalRequested) {
    const result = {};
    investors.forEach(inv => result[inv.name] = inv.requested_amount);
    logger.info('Sufficient allocation - everyone gets full request', result);
    return result;
  }

  logger.debug('Limited allocation scenario - beginning iterative proration');
  
  const result = {};
  const active = new Set(investors.map(inv => inv.name));
  let remainingAllocation = allocationAmount;
  
  investors.forEach(inv => result[inv.name] = 0);
  
  let iteration = 0;
  const maxIterations = investors.length + 1;
  
  while (active.size > 0 && remainingAllocation > 0.000001 && iteration < maxIterations) {
    iteration++;
    logger.debug(`Iteration ${iteration}`, {
      activeInvestors: active.size,
      remainingAllocation: remainingAllocation.toFixed(6)
    });
    
    const activeInvestors = investors.filter(inv => active.has(inv.name));
    
    const totalAverage = activeInvestors.reduce((sum, inv) => sum + inv.average_amount, 0);
    
    if (totalAverage === 0) {
      const equalShare = remainingAllocation / activeInvestors.length;
      activeInvestors.forEach(inv => {
        const canReceive = Math.min(equalShare, inv.requested_amount - result[inv.name]);
        result[inv.name] += canReceive;
        remainingAllocation -= canReceive;
      });
      break;
    }
    
    const capped = [];
    let allocationUsedThisRound = 0;
    
    activeInvestors.forEach(inv => {
      const proratedAmount = (inv.average_amount / totalAverage) * remainingAllocation;
      const currentTotal = result[inv.name];
      const maxCanReceive = inv.requested_amount - currentTotal;
      
      if (proratedAmount >= maxCanReceive - 0.000001) {
        result[inv.name] = inv.requested_amount;
        allocationUsedThisRound += maxCanReceive;
        capped.push(inv.name);
        active.delete(inv.name);
        
        logger.debug(`${inv.name} capped at ${inv.requested_amount}`);
      } else {
        result[inv.name] += proratedAmount;
        allocationUsedThisRound += proratedAmount;
      }
    });
    
    remainingAllocation -= allocationUsedThisRound;
    
    if (capped.length === 0) {
      break;
    }
  }
  
  if (remainingAllocation > 0.000001) {
    logger.warn(`Remaining dust allocation: ${remainingAllocation}`);
    const notAtCap = investors.filter(inv => 
      result[inv.name] < inv.requested_amount - 0.000001
    ).sort((a, b) => b.requested_amount - a.requested_amount);
    
    if (notAtCap.length > 0) {
      const recipient = notAtCap[0].name;
      const canReceive = Math.min(remainingAllocation, notAtCap[0].requested_amount - result[recipient]);
      result[recipient] += canReceive;
      logger.debug(`Allocated dust to ${recipient}: ${canReceive}`);
    }
  }

  Object.keys(result).forEach(name => {
    result[name] = Math.round(result[name] * 100000) / 100000;
  });

  logger.info('Proration calculation complete', result);
  
  const totalAllocated = Object.values(result).reduce((sum, val) => sum + val, 0);
  logger.info('Verification', {
    totalAllocated: totalAllocated.toFixed(6),
    targetAllocation: allocationAmount.toFixed(6),
    difference: Math.abs(totalAllocated - allocationAmount).toFixed(6)
  });

  return result;
}

function prorate(input) {
  logger.info('=== Starting Proration Process ===');
  
  const validation = validateInput(input);
  if (!validation.isValid) {
    logger.error('Validation failed', validation.error);
    return { error: validation.error };
  }

  try {
    const result = calculateProration(
      input.allocation_amount,
      input.investor_amounts
    );
    
    logger.info('=== Proration Process Complete ===');
    return result;
  } catch (error) {
    logger.error('Proration calculation failed', error);
    return { error: 'Internal calculation error: ' + error.message };
  }
}

module.exports = {
  prorate,
  calculateProration,
  validateInput,
  Logger
};
