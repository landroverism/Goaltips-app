
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockMatches, mockUserStats } from '../data/mockData';
import PredictionChart from '../components/admin/PredictionChart';
import StatsSummary from '../components/admin/StatsSummary';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import AdminPredictionManager from '../components/admin/AdminPredictionManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to view this page.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  // Sample data for admin analytics
  const marketData = [
    { name: '1X2', value: 65 },
    { name: 'BTTS', value: 20 },
    { name: 'Over/Under', value: 10 },
    { name: 'Double Chance', value: 5 },
    { name: 'Correct Score', value: 3 },
    { name: 'First Goalscorer', value: 2 },
  ];
  
  const leagueData = [
    { name: 'Premier League', value: 40 },
    { name: 'La Liga', value: 25 },
    { name: 'Bundesliga', value: 15 },
    { name: 'Serie A', value: 10 },
    { name: 'Ligue 1', value: 10 },
  ];
  
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#607D8B', '#3F51B5'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.username}. Here's your analytics overview.
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Manage Predictions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Prediction Performance</h2>
            <StatsSummary userStats={mockUserStats} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PredictionChart userStats={mockUserStats} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Predictions by Market</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {marketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictions by League</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leagueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {leagueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <span className="text-lg">12</span>
                      <span className="text-sm text-muted-foreground">Pending Matches</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <span className="text-lg">5</span>
                      <span className="text-sm text-muted-foreground">Live Matches</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <span className="text-lg">354</span>
                      <span className="text-sm text-muted-foreground">Total Users</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <span className="text-lg">1,205</span>
                      <span className="text-sm text-muted-foreground">Predictions Today</span>
                    </Button>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button onClick={() => setActiveTab('predictions')}>
                      Manage Predictions
                    </Button>
                    <Button variant="outline">
                      View All Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="predictions">
          <AdminPredictionManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
