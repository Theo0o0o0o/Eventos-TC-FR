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
    <div className="glass-card rounded-[1.8rem] p-4 md:p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between md:hidden">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 px-4">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="default" className="ml-1 flex h-5 w-5 items-center justify-center p-0 text-[10px] tracking-normal">
                {selectedTypes.length + (selectedDate !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 px-2">
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        <div className={cn('flex flex-col gap-4', !showFilters && 'hidden md:flex')}>
          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
            <span className="editorial-subtitle flex shrink-0 items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              Tipo
            </span>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <Button
                    key={type}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleType(type)}
                    className="px-4"
                  >
                    {eventTypeLabels[type]}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
            <span className="editorial-subtitle flex shrink-0 items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Data
            </span>
            <div className="flex flex-wrap gap-2">
              {dateFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedDate === filter.value ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => onDateChange(filter.value)}
                  className="px-4"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="md:ml-auto">
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
