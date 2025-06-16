
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Star, Zap } from 'lucide-react';
import { Turf } from '@/types';

const TurfCard = ({ turf }: { turf: Turf }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="relative">
          <img src={turf.images?.[0] || 'https://images.unsplash.com/photo-1599384262948-43891461ce78?auto=format&fit=crop&q=80'} alt={turf.name} className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-800 flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1.5" /> {turf.rating}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold text-gray-900 truncate">{turf.name}</CardTitle>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="w-4 h-4 mr-1.5" />
          <span>{turf.address}</span>
        </div>
        <p className="text-lg font-bold text-primary mt-2">
          ${turf.rent}<span className="text-sm font-normal text-gray-500">/hour</span>
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/turfs/${turf.id}`}>
            <Zap className="w-4 h-4 mr-2" />
            Book Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TurfCard;

