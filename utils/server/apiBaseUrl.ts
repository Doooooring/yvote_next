export function apiBaseUrl() {
  return (
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000'
  );
}
