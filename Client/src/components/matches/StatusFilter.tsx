
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Status = 'upcoming' | 'live' | 'completed';

interface StatusFilterProps {
  selectedStatuses: Status[];
  onStatusChange: (statuses: Status[]) => void;
}

const statuses: { id: Status; name: string }[] = [
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'live', name: 'Live' },
  { id: 'completed', name: 'Completed' },
];

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatuses, onStatusChange }) => {
  const handleStatusToggle = (statusId: Status) => {
    if (selectedStatuses.includes(statusId)) {
      onStatusChange(selectedStatuses.filter(id => id !== statusId));
    } else {
      onStatusChange([...selectedStatuses, statusId]);
    }
  };

  const handleSelectAll = () => {
    onStatusChange(['upcoming', 'live', 'completed']);
  };

  const handleClearAll = () => {
    onStatusChange([]);
  };

  const selectedCount = selectedStatuses.length;
  const totalCount = statuses.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          <span>Status</span>
          <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
            {selectedCount > 0 ? `${selectedCount}/${totalCount}` : 'All'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex justify-between px-2 py-1.5">
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>Select All</Button>
          <Button variant="ghost" size="sm" onClick={handleClearAll}>Clear</Button>
        </div>
        <DropdownMenuSeparator />
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.id}
            checked={selectedStatuses.includes(status.id)}
            onCheckedChange={() => handleStatusToggle(status.id)}
          >
            {status.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusFilter;
