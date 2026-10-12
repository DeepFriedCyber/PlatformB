// Test setup - ensures consistent behavior across tests
import * as dotenv from 'dotenv';

// Load environment variables if needed
dotenv.config();

// Configure any test-specific globals here
if (typeof window !== 'undefined') {
  // Mock any browser APIs that might be used in components
}

export {};
