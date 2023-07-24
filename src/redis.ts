import Redis from 'ioredis';

const redis = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
});

async function main() {
  // Set a key
  await redis.set('key', 'value');

  // Get a key
  const value = await redis.get('key');
  console.log(value); // Outputs: 'value'

  // Delete a key
  await redis.del('key');

  // Verify deletion
  const deletedValue = await redis.get('key');
  console.log(deletedValue); // Outputs: null
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
