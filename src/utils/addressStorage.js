const ADDRESSES_KEY = 'userAddresses';

/**
 * Generates a unique ID for an address
 */
function generateId() {
  return Date.now().toString();
}

/**
 * Returns array of saved address objects
 */
export function getSavedAddresses() {
  try {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading saved addresses:', error);
    return [];
  }
}

/**
 * Saves a new address. Auto-generates id and sets isDefault if first.
 * Returns the saved address object.
 */
export function saveAddress(address) {
  try {
    const current = getSavedAddresses();
    
    const newAddress = {
      id: generateId(),
      ...address,
      isDefault: address.isDefault !== undefined ? address.isDefault : current.length === 0,
    };
    
    const updated = [...current, newAddress];
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
    
    return newAddress;
  } catch (error) {
    console.error('Error saving address:', error);
    return null;
  }
}

/**
 * Removes address by id. Returns updated array.
 */
export function deleteAddress(id) {
  try {
    const current = getSavedAddresses();
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting address:', error);
    return getSavedAddresses();
  }
}

/**
 * Updates an existing address by id. Returns updated array.
 */
export function updateAddress(id, updates) {
  try {
    const current = getSavedAddresses();
    const updated = current.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating address:', error);
    return getSavedAddresses();
  }
}

/**
 * Sets one address as default, clears default from all others.
 * Returns updated array.
 */
export function setDefaultAddress(id) {
  try {
    const current = getSavedAddresses();
    const updated = current.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error setting default address:', error);
    return getSavedAddresses();
  }
}

/**
 * Returns the default address, or the first one, or null.
 */
export function getDefaultAddress() {
  try {
    const addresses = getSavedAddresses();
    const defaultAddr = addresses.find(a => a.isDefault);
    return defaultAddr || addresses[0] || null;
  } catch (error) {
    console.error('Error getting default address:', error);
    return null;
  }
}
