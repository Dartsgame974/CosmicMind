
export interface Metadata {
    title: string;
    description: string;
    thumbnail: string;
    images: string[];
    source: "twitter" | "youtube" | "web" | "reddit";
}

export async function fetchMetadata(url: string): Promise<Metadata> {
    const cleanUrl = url.trim();

    // Detect Source just for initial UI state if needed, but backend confirms it
    let source: Metadata["source"] = "web";
    if (cleanUrl.match(/twitter\.com|x\.com/)) source = "twitter";
    else if (cleanUrl.match(/youtube\.com|youtu\.be/)) source = "youtube";
    else if (cleanUrl.match(/reddit\.com/)) source = "reddit";

    try {
        console.log("Fetching metadata via backend for:", cleanUrl);
        const response = await fetch(`http://localhost:3001/api/metadata?url=${encodeURIComponent(cleanUrl)}`);

        if (!response.ok) {
            console.error("Backend error status:", response.status);
            throw new Error("Backend connection failed");
        }

        const data = await response.json();
        return {
            title: data.title || cleanUrl,
            description: data.description || "",
            thumbnail: data.thumbnail || "",
            images: data.images || [],
            source: (data.source as any) || source
        };

    } catch (error) {
        console.error("Metadata fetch failed:", error);
        return {
            title: cleanUrl,
            description: "Could not fetch metadata (Ensure Backend is running: npm start in /server)",
            thumbnail: "",
            images: [],
            source: source
        };
    }
}
