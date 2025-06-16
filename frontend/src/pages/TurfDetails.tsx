
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTurfById } from '@/hooks/useTurfById';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Phone, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

const TurfDetails = () => {
  const { id } = useParams<{ id: string }>();
  const turfId = id ? parseInt(id) : 0;
  const { data: turf, isLoading, isError, error } = useTurfById(turfId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !turf) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error loading turf details</AlertTitle>
          <AlertDescription>
            {(error as any)?.message || "Turf not found. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={turf.images[selectedImage] || 'https://images.unsplash.com/photo-1599384262948-43891461ce78?auto=format&fit=crop&q=80'} 
              alt={turf.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {turf.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <img src={image} alt={`${turf.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Turf Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{turf.name}</h1>
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-semibold">{turf.rating}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{turf.location}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{turf.description}</p>
          </div>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ${turf.pricePerHour}
                <span className="text-lg font-normal text-gray-500">/hour</span>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {turf.openTime} - {turf.closeTime}
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{turf.contactNumber}</p>
            </CardContent>
          </Card>

          {/* Sports Available */}
          <Card>
            <CardHeader>
              <CardTitle>Sports Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {turf.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">
                    {sport}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {turf.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Book Now Button */}
          <Button asChild size="lg" className="w-full">
            <Link to={`/book/${turf.id}`}>
              <Zap className="w-5 h-5 mr-2" />
              Book This Turf
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TurfDetails;
