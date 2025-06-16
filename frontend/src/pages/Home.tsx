
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TurfCard from '@/components/TurfCard';
import { MapPin, Search } from 'lucide-react';
import { useTurfs } from '@/hooks/useTurfs';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { data: turfs, isLoading } = useTurfs();
  const featuredTurfs = turfs?.slice(0, 3) || [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599384262948-43891461ce78?auto=format&fit=crop&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Find & Book Your Perfect Turf</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl">The easiest way to book football, cricket, and other sports turfs near you. Your next game is just a few clicks away.</p>
          <div className="mt-8 w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center shadow-lg">
             <MapPin className="h-6 w-6 mx-4 text-gray-400" />
             <input type="text" placeholder="Search by location, turf name..." className="flex-grow bg-transparent focus:outline-none text-gray-800" />
             <Button asChild className="rounded-full">
                <Link to="/turfs">
                    <Search className="h-5 w-5 mr-2"/>
                    Search
                </Link>
             </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Turfs Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Turfs</h2>
            <p className="mt-4 text-lg text-gray-600">Check out our most popular turfs booked by players like you.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="space-y-2">
                   <Skeleton className="h-56 w-full rounded-lg" />
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-4 w-1/2" />
                   <Skeleton className="h-10 w-full mt-2" />
               </div>
            ))}
            {!isLoading && featuredTurfs.map(turf => (
              <TurfCard key={turf.id} turf={turf} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/turfs">View All Turfs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

