// @refresh reload
import { QueryClientProvider, QueryClient } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Meta,
    Routes,
    Scripts,
    Title,
} from "solid-start";
import "./root.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retryOnMount: false,
        },
    },
});

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>SolidStart - With TailwindCSS</Title>
                <Meta charset="utf-8" />
                <Meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <QueryClientProvider client={queryClient}>
                            <Routes>
                                <FileRoutes />
                            </Routes>
                        </QueryClientProvider>
                    </ErrorBoundary>
                </Suspense>
                <Scripts />
            </Body>
        </Html>
    );
}
