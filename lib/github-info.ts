export interface FetchRepositoryInfoOptions {
  owner: string;
  repo: string;

  baseUrl?: string;
  token?: string;
  fetchOptions?: RequestInit;
}

export interface RepositoryInfo {
  stars: number;
  forks: number;
}

export async function fetchRepositoryInfo({
  owner,
  repo,
  token,
  baseUrl = 'https://api.github.com',
  fetchOptions = {
    // default revalidate options for Next.js (optional)
    next: {
      revalidate: 60,
    },
  } as RequestInit,
}: FetchRepositoryInfoOptions): Promise<RepositoryInfo | null> {
  const endpoint = `${baseUrl}/repos/${owner}/${repo}`;
  const headers = new Headers(fetchOptions.headers);

  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal ?? AbortSignal.timeout(3000),
    } as RequestInit);

    if (!response.ok) return null;

    const data = await response.json();
    if (!Number.isFinite(data?.stargazers_count) || !Number.isFinite(data?.forks_count)) {
      return null;
    }

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
    };
  } catch {
    // Repository statistics are optional and must not block documentation rendering.
    return null;
  }
}
