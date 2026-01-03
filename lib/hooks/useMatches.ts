import { useQuery } from '@tanstack/react-query';

export function useMatches() {
    return useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            const response = await fetch('/api/staff/schedule');
            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }
            const data = await response.json();
            return data.matches; // Extract matches array
        },
        staleTime: 10 * 60 * 1000, // 10 phút
    });
}
