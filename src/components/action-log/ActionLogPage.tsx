import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActionLog, ActionLog } from '@/hooks/useActionLog';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Filter, Search, RefreshCw } from 'lucide-react';

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'create': return '✨';
    case 'update': return '✏️';
    case 'delete': return '🗑️';
    case 'upload': return '📤';
    case 'download': return '📥';
    case 'view': return '👁️';
    case 'share': return '🔗';
    case 'restore': return '🔄';
    default: return '📝';
  }
};

const getActionColor = (actionType: string) => {
  switch (actionType) {
    case 'create': return 'bg-green-500/10 text-green-700 border-green-200';
    case 'update': return 'bg-blue-500/10 text-blue-700 border-blue-200';
    case 'delete': return 'bg-red-500/10 text-red-700 border-red-200';
    case 'upload': return 'bg-purple-500/10 text-purple-700 border-purple-200';
    case 'download': return 'bg-indigo-500/10 text-indigo-700 border-indigo-200';
    case 'view': return 'bg-gray-500/10 text-gray-700 border-gray-200';
    case 'share': return 'bg-orange-500/10 text-orange-700 border-orange-200';
    case 'restore': return 'bg-cyan-500/10 text-cyan-700 border-cyan-200';
    default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
  }
};

export default function ActionLogPage() {
  const { logs, loading, fetchLogs } = useActionLog();
  const [filteredLogs, setFilteredLogs] = useState<ActionLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action_type === actionFilter);
    }

    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entity_type === entityFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter, entityFilter]);

  const entityTypes = [...new Set(logs.map(log => log.entity_type))];
  const actionTypes = [...new Set(logs.map(log => log.action_type))];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Action Log</h1>
        </div>
        <Button onClick={() => fetchLogs()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {getActionIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entityTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Log List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading actions...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No actions found matching your filters
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-2xl">{getActionIcon(log.action_type)}</div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getActionColor(log.action_type)}>
                        {log.action_type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {log.entity_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="font-medium">
                      {log.entity_name || `${log.entity_type} ${log.entity_id?.slice(0, 8)}...`}
                    </div>
                    
                    {log.description && (
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                    )}
                    
                    {Object.keys(log.metadata || {}).length > 0 && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View metadata
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}