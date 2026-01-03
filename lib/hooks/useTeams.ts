import { useQuery } from '@tanstack/react-query';

export function useTeams() {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const response = await fetch('/api/staff/resources/teams');
            if (!response.ok) {
                throw new Error('Failed to fetch teams');
            }
            return response.json();
        },
        staleTime: 30 * 60 * 1000, // 30 phút (teams ít thay đổi)
    });
}
