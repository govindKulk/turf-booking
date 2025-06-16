
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getAllTurfs, createTurf, updateTurf, deleteTurf } from '@/lib/adminApi';
import { TurfEntity, TurfDto, TurfStatus, GeoJsonPoint } from '@/types';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminTurfManagement = () => {
  const [turfs, setTurfs] = useState<TurfEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTurf, setEditingTurf] = useState<TurfEntity | null>(null);

  const {admin} = useAdminAuth();
  const [formData, setFormData] = useState<TurfDto>({
    name: '',
    status: TurfStatus.ACTIVE,
    owner: admin.id,
    manager: admin.id,
    rent: 0,
    amenities: '',
    phone: '',
    email: '',
    address: '',
    coordinates: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const data = await getAllTurfs(admin.id.toString());
      setTurfs(data);
    } catch (error) {
      toast.error('Failed to fetch turfs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'longitude' || name === 'latitude') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          coordinates: name === 'longitude' 
            ? [parseFloat(value) || 0, prev.coordinates.coordinates[1]]
            : [prev.coordinates.coordinates[0], parseFloat(value) || 0]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'owner' || name === 'manager' || name === 'rent' 
          ? parseInt(value) || 0 
          : value
      }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as TurfStatus
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTurf) {
        await updateTurf(editingTurf.id, formData);
        toast.success('Turf updated successfully');
      } else {
        await createTurf(formData);
        toast.success('Turf created successfully');
      }
      fetchTurfs();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(editingTurf ? 'Failed to update turf' : 'Failed to create turf');
    }
  };

  const handleEdit = (turf: TurfEntity) => {
    setEditingTurf(turf);
    setFormData({
      id: turf.id,
      name: turf.name,
      status: turf.status,
      owner: turf.owner,
      manager: turf.manager,
      rent: turf.rent,
      amenities: turf.amenities,
      phone: turf.phone,
      email: turf.email,
      address: turf.address,
      coordinates: turf.coordinates
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this turf?')) {
      try {
        await deleteTurf(id);
        toast.success('Turf deleted successfully');
        fetchTurfs();
      } catch (error) {
        toast.error('Failed to delete turf');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      name: '',
      status: TurfStatus.ACTIVE,
      
      rent: 0,
      amenities: '',
      phone: '',
      email: '',
      address: '',
      coordinates: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });
    setEditingTurf(null);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading turfs...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Turf Management</h1>
          <p className="text-gray-600">Manage all turfs in the system</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Turf
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTurf ? 'Edit Turf' : 'Create New Turf'}</DialogTitle>
              <DialogDescription>
                {editingTurf ? 'Update turf information' : 'Add a new turf to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TurfStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={TurfStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={TurfStatus.PENDING}>Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
            

              <div className="space-y-2">
                <Label htmlFor="rent">Rent per Hour</Label>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  value={formData.rent}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="Wi-Fi, Parking, Restrooms"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.coordinates.coordinates[0]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.coordinates.coordinates[1]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTurf ? 'Update' : 'Create'} Turf
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Turfs</CardTitle>
          <CardDescription>
            {turfs.length} turfs in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rent/Hour</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turfs.map((turf) => (
                <TableRow key={turf.id}>
                  <TableCell className="font-medium">{turf.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      turf.status === TurfStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                      turf.status === TurfStatus.INACTIVE ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {turf.status}
                    </span>
                  </TableCell>
                  <TableCell>₹{turf.rent}</TableCell>
                  <TableCell>{turf.address}</TableCell>
                  <TableCell>{turf.phone}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(turf)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(turf.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTurfManagement;
