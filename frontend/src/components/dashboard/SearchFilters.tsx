
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Grid3X3, ListFilter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  subjectOptions: string[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  subjectOptions,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          {subjectOptions.map(subject => (
            <SelectItem key={subject} value={subject}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
          aria-label="List view"
        >
          <ListFilter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
