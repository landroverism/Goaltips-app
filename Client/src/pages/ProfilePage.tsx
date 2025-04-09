
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { mockPredictions, mockUserStats, mockMatches } from '../data/mockData';
import { Sun, Moon, User, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import PredictionChart from '../components/admin/PredictionChart';
import StatsSummary from '../components/admin/StatsSummary';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the actual update
    setIsEditing(false);
    // Display a success message
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        <Button asChild>
          <a href="/login">Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 gap-6">
          <div>
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground mb-2">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              {user.isAdmin ? 'Admin Account' : 'Member Account'}
            </p>
            
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={() => setActiveTab('account')}>
                <User className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('predictions')}>
                Predictions
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      {isEditing && (
                        <>
                          <Separator />
                          
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              placeholder="Enter your current password"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleChange}
                              placeholder="Enter new password"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end mt-6 space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!isEditing && (
                    <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Manage your application preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="theme">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle between light and dark theme
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          id="theme"
                          checked={theme === 'dark'}
                          onCheckedChange={toggleTheme}
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Danger Zone */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Actions that you cannot undo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Logout from all devices</Label>
                        <p className="text-sm text-muted-foreground">
                          This will end all your active sessions
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Logout All
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Delete Account</Label>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions">
            <div className="space-y-8">
              <StatsSummary userStats={mockUserStats} />
              
              <div className="grid grid-cols-1 gap-6">
                <PredictionChart userStats={mockUserStats} />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Predictions</CardTitle>
                  <CardDescription>
                    Your latest predictions and their results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPredictions.map(prediction => {
                      // Find the match for this prediction
                      const match = mockMatches.find(m => m.id === prediction.matchId);
                      if (!match) return null;
                      
                      return (
                        <div 
                          key={prediction.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              prediction.result === 'win' 
                                ? 'bg-green-500' 
                                : prediction.result === 'loss' 
                                  ? 'bg-red-500' 
                                  : 'bg-yellow-500'
                            }`} />
                            <div>
                              <p className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</p>
                              <p className="text-sm text-muted-foreground">{match.leagueName}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">
                              {prediction.market === 'home' && match.homeTeam.name}
                              {prediction.market === 'away' && match.awayTeam.name}
                              {prediction.market === 'draw' && 'Draw'}
                              {prediction.market === 'bttsYes' && 'BTTS: Yes'}
                              {prediction.market === 'bttsNo' && 'BTTS: No'}
                              {prediction.market === 'over25' && 'Over 2.5'}
                              {prediction.market === 'under25' && 'Under 2.5'}
                            </p>
                            <p className={`text-sm ${
                              prediction.result === 'win' 
                                ? 'text-green-500' 
                                : prediction.result === 'loss' 
                                  ? 'text-red-500' 
                                  : 'text-yellow-500'
                            }`}>
                              {prediction.result === 'win' && 'Win'}
                              {prediction.result === 'loss' && 'Loss'}
                              {prediction.result === 'pending' && 'Pending'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Predictions
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
