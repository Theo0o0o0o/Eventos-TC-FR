import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { eventTypeLabels, Event } from '@/data/mockData';
import { Calendar, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventFiltersProps {
  selectedTypes: Event['type'][];
  onTypeChange: (types: Event['type'][]) => void;
  selectedDate: 'all' | 'today' | 'week' | 'month';
  onDateChange: (date: 'all' | 'today' | 'week' | 'month') => void;
}

const eventTypes: Event['type'][] = ['theater', 'presentation', 'lecture', 'fair', 'workshop', 'exhibition', 'sports', 'other'];

const dateFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mês' },
] as const;

export function EventFilters({ selectedTypes, onTypeChange, selectedDate, onDateChange }: EventFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (type: Event['type']) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onTypeChange([]);
    onDateChange('all');
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedDate !== 'all';

  return (
    <div className="glass-card rounded-[1.5rem] p-4 md:p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between md:hidden">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 rounded-xl">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="default" className="ml-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                {selectedTypes.length + (selectedDate !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 rounded-xl">
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        <div
          className={cn(
            'flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2',
            !showFilters && 'hidden md:flex',
          )}
        >
          <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Tipo:
          </span>
          {eventTypes.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <Button
                key={type}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleType(type)}
                className="gap-1 rounded-xl"
              >
                {eventTypeLabels[type]}
              </Button>
            );
          })}

          <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground md:ml-2">
            <Calendar className="h-4 w-4" />
            Data:
          </span>
          {dateFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedDate === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDateChange(filter.value)}
              className="rounded-xl"
            >
              {filter.label}
            </Button>
          ))}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto hidden gap-1 rounded-xl md:inline-flex">
              <X className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
