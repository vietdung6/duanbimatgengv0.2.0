'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data được coi là "fresh" trong 10 phút
                        staleTime: 10 * 60 * 1000,
                        // Garbage collection time - cache được giữ trong memory 30 phút
                        gcTime: 30 * 60 * 1000,
                        // Không tự động refetch khi focus window
                        refetchOnWindowFocus: false,
                        // Không refetch khi mount nếu có cache
                        refetchOnMount: false,
                        // Chỉ retry 1 lần nếu fail (giảm server load)
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
