import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ConferenceCard from "@/components/ConferenceCard";
import conferencesData from "@/data/conferences.yml";
import { Conference } from "@/types/conference";
import { useState, useMemo, useEffect } from "react";
import { Switch } from "@/components/ui/switch"
import { parseISO, isValid, isPast } from "date-fns";
import { extractCountry } from "@/utils/countryExtractor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronRight, Filter } from "lucide-react";
import { getAllCountries } from "@/utils/countryExtractor";

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPastConferences, setShowPastConferences] = useState(false);

  // Category buttons configuration
  const categoryButtons = [
    { id: "machine-learning", label: "Machine Learning" },
    { id: "lifelong-learning", label: "Lifelong Learning" },
    { id: "robotics", label: "Robotics" },
    { id: "computer-vision", label: "Computer Vision" },
    { id: "web-search", label: "Web Search" },
    { id: "data-mining", label: "Data Mining" },
    { id: "natural-language-processing", label: "Natural Language Processing" },
    { id: "signal-processing", label: "Signal Processing" },
    { id: "human-computer-interaction", label: "Human Computer Interaction" },
    { id: "computer-graphics", label: "Computer Graphics" },
    { id: "mathematics", label: "Mathematics" },
    { id: "reinforcement-learning", label: "Reinforcement Learning" },
  ];

  const filteredConferences = useMemo(() => {
    if (!Array.isArray(conferencesData)) {
      console.error("Conferences data is not an array:", conferencesData);
      return [];
    }

    return conferencesData
      .filter((conf: Conference) => {
        // Filter by deadline (past/future)
        const deadlineDate = conf.deadline && conf.deadline !== 'TBD' ? parseISO(conf.deadline) : null;
        const isUpcoming = !deadlineDate || !isValid(deadlineDate) || !isPast(deadlineDate);
        if (!showPastConferences && !isUpcoming) return false;

        // Filter by tags
        const matchesTags = selectedTags.size === 0 || 
          (Array.isArray(conf.tags) && conf.tags.some(tag => selectedTags.has(tag)));
        
        // Filter by countries
        const matchesCountry = selectedCountries.size === 0 || 
          (conf.country && selectedCountries.has(conf.country));
        
        // Filter by search query
        const matchesSearch = searchQuery === "" || 
          conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (conf.full_name && conf.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesTags && matchesCountry && matchesSearch;
      })
      .sort((a: Conference, b: Conference) => {
        const dateA = a.deadline && a.deadline !== 'TBD' ? parseISO(a.deadline).getTime() : Infinity;
        const dateB = b.deadline && b.deadline !== 'TBD' ? parseISO(b.deadline).getTime() : Infinity;
        return dateA - dateB;
      });
  }, [selectedTags, selectedCountries, searchQuery, showPastConferences]);

  // Update handleTagsChange to handle multiple tags
  const handleTagsChange = (newTags: Set<string>) => {
    setSelectedTags(newTags);
    const searchParams = new URLSearchParams(window.location.search);
    if (newTags.size > 0) {
      searchParams.set('tags', Array.from(newTags).join(','));
    } else {
      searchParams.delete('tags');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  const handleCountriesChange = (newCountries: Set<string>) => {
    setSelectedCountries(newCountries);
    const searchParams = new URLSearchParams(window.location.search);
    if (newCountries.size > 0) {
      searchParams.set('countries', Array.from(newCountries).join(','));
    } else {
      searchParams.delete('countries');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  // Toggle a single tag
  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    handleTagsChange(newTags);
  };

  // Load filters from URL on initial render
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tagsParam = searchParams.get('tags');
    const countriesParam = searchParams.get('countries');
    
    if (tagsParam) {
      const tags = tagsParam.split(',');
      setSelectedTags(new Set(tags));
    }
    
    if (countriesParam) {
      const countries = countriesParam.split(',');
      setSelectedCountries(new Set(countries));
    }
  }, []);

  if (!Array.isArray(conferencesData)) {
    return <div>Loading conferences...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header 
        onSearch={setSearchQuery} 
        showEmptyMessage={
          (selectedTags.size > 0 || selectedCountries.size > 0) && 
          filteredConferences.length === 0 && 
          !showPastConferences
        }
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 py-4">
          {/* Category filter buttons */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTags.has(category.id)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleTag(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Controls row with past conferences toggle and country filter */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
              <label htmlFor="show-past" className="text-sm text-neutral-600">
                Show past conferences
              </label>
              <Switch
                id="show-past"
                checked={showPastConferences}
                onCheckedChange={setShowPastConferences}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-4 w-4" />
                    Filter by Country
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white" align="start">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-800">Country</h4>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2 bg-white">
                        {getAllCountries(conferencesData as Conference[]).map(country => (
                          <div key={country} className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded">
                            <Checkbox 
                              id={`country-${country}`}
                              checked={selectedCountries.has(country)}
                              onCheckedChange={() => {
                                const newCountries = new Set(selectedCountries);
                                if (newCountries.has(country)) {
                                  newCountries.delete(country);
                                } else {
                                  newCountries.add(country);
                                }
                                handleCountriesChange(newCountries);
                              }}
                            />
                            <label 
                              htmlFor={`country-${country}`}
                              className="text-sm font-medium text-gray-700 cursor-pointer w-full py-1"
                            >
                              {country}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Display selected countries */}
              {Array.from(selectedCountries).map(country => (
                <button
                  key={country}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium"
                  onClick={() => {
                    const newCountries = new Set(selectedCountries);
                    newCountries.delete(country);
                    handleCountriesChange(newCountries);
                  }}
                >
                  {country}
                  <X className="ml-1 h-3 w-3" />
                </button>
              ))}
              
              {/* Clear all filters button */}
              {(selectedTags.size > 0 || selectedCountries.size > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleTagsChange(new Set());
                    handleCountriesChange(new Set());
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConferences.map((conference: Conference) => (
            <ConferenceCard key={conference.id} {...conference} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
