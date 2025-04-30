/**
 * Gets the appropriate ID from a client object, handling both MongoDB _id and client-side id
 */
interface ClientWithId {
  _id?: string;
  id?: string;
}

export const getClientId = (client: ClientWithId): string => {
  // First try to use MongoDB _id
  if (client._id) {
    return client._id;
  }
  
  // Fall back to client-side id
  if (client.id) {
    return client.id;
  }
  
  // If neither exists, return a string that makes it clear there's an issue
  console.error('Client has no valid ID:', client);
  return 'no-id';
};
