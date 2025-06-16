
import TurfCard from "@/components/TurfCard";
import { Input } from "@/components/ui/input";
import { Search, TriangleAlert } from "lucide-react";
import { useTurfs } from "@/hooks/useTurfs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Turfs = () => {
    const { data: turfs, isLoading, isError, error } = useTurfs();

    const renderSkeletons = () => (
        Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-56 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
            </div>
        ))
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Find Your Turf</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
                    Search from our wide selection of high-quality sports turfs.
                </p>
                <div className="mt-6 max-w-lg mx-auto">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="search"
                            placeholder="Search by name, sport, or location..."
                            className="w-full pl-10"
                        />
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoading && renderSkeletons()}
                
                {isError && (
                    <div className="col-span-full">
                        <Alert variant="destructive" className="max-w-2xl mx-auto">
                           <TriangleAlert className="h-4 w-4" />
                           <AlertTitle>Error fetching turfs</AlertTitle>
                           <AlertDescription>
                               { (error as any)?.message || "Something went wrong. Please try again later."}
                           </AlertDescription>
                       </Alert>
                    </div>
                )}
                
                {turfs && turfs.map(turf => (
                    <TurfCard key={turf.id} turf={turf} />
                ))}

                {!isLoading && !isError && turfs?.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-800">No Turfs Found</h2>
                        <p className="mt-2 text-gray-500">We couldn't find any available turfs. Please try adjusting your search or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Turfs;

