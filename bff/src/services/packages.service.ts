import api from "src/utils/fetcher";

interface PackageData {
    count: number;
    next: string | null;
    results: Package[];
}

interface Package {
    id: number;
    name: string;
    description: string;
    thumbnail: string | null;
    industry: number;
    categories: number[];
    products: number[];
}

export const getMergedPackages = async (page: number, pageSize: number) => {
    const packageRes = await api.get<PackageData>("/packages/", {
        params: { page, page_size: pageSize },
    });

    const packageData = packageRes.data;
    console.log("ddd")
    const enrichedResults = await Promise.all(
        packageData.results.map(async (pkg: any) => {
            const productDetails = await Promise.all(
                pkg.products.map((productId: number) =>
                    api.get(`/products/${productId}/`).then((res) => res.data)
                )
            );

            return {
                ...pkg,
                products: productDetails,
            };
        })
    );

    const nextPage = getNextPageNumber(packageData.next);

    return {
        count: packageData.count,
        nextPage,
        results: enrichedResults,
    };
};

const getNextPageNumber = (nextUrl: string | null): number | null => {
    if (!nextUrl) return null;
    const match = nextUrl.match(/page=(\d+)/);
    return match ? Number(match[1]) : null;
};
