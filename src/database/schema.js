/**
 * @typedef {Object} User
 * @property {number} [id]
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'admin'|'operator'|'ba'|'pmo'} role
 * @property {number} cooperativeId
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Cooperative
 * @property {number} [id]
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Member
 * @property {number} [id]
 * @property {number} cooperativeId
 * @property {string} memberNumber
 * @property {string} name
 * @property {string} phone
 * @property {string} address
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Savings
 * @property {number} [id]
 * @property {number} memberId
 * @property {number} amount
 * @property {'deposit'|'withdrawal'} type
 * @property {string} description
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Loan
 * @property {number} [id]
 * @property {number} memberId
 * @property {number} principal
 * @property {number} interest
 * @property {number} paidAmount
 * @property {number} remainingAmount
 * @property {Date} dueDate
 * @property {'pending'|'active'|'completed'|'overdue'|'rejected'} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Product
 * @property {number} [id]
 * @property {string} name
 * @property {string} category
 * @property {number} price
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Inventory
 * @property {number} [id]
 * @property {number} productId
 * @property {number} stock
 * @property {number} minimumStock
 * @property {string} location
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Transaction
 * @property {number} [id]
 * @property {'sale'|'purchase'|'expense'|'income'|'transfer'} type
 * @property {string} referenceId
 * @property {number} amount
 * @property {string} description
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Notification
 * @property {number} [id]
 * @property {'info'|'warning'|'error'|'success'} type
 * @property {string} title
 * @property {string} message
 * @property {boolean} read
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} ActivityLog
 * @property {number} [id]
 * @property {'create'|'update'|'delete'} action
 * @property {string} entity
 * @property {number} entityId
 * @property {object} payload
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} SyncQueueItem
 * @property {number} [id]
 * @property {'create'|'update'|'delete'} operation
 * @property {string} entity
 * @property {number} entityId
 * @property {object} payload
 * @property {'pending'|'syncing'|'failed'|'completed'} status
 * @property {number} retryCount
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Setting
 * @property {number} [id]
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {Object} Module
 * @property {number} [id]
 * @property {string} key
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} route
 * @property {'utama'|'operasional'|'tim'|'的其他'} category
 * @property {boolean} enabled
 * @property {number} order
 * @property {string[]} [dependencies]
 * @property {boolean} [comingSoon]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export const ModuleCategory = {
  UTAMA: 'utama',
  OPERASIONAL: 'operasional',
  TIM: 'tim',
  LAINNYA: 'lainnya',
};

export const ModuleStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  COMING_SOON: 'coming_soon',
};

export const LoanStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  REJECTED: 'rejected',
};

export const TransactionType = {
  SALE: 'sale',
  PURCHASE: 'purchase',
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
};

export const NotificationType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

export const SyncStatus = {
  PENDING: 'pending',
  SYNCING: 'syncing',
  FAILED: 'failed',
  COMPLETED: 'completed',
};

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const SavingType = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
};
