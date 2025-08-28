import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';

export const TutorialsPage: React.FC = () => {
  const { language } = useApp();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  const { data: tutorials, isLoading } = useQuery({
    queryKey: ['tutorials', language, category, difficulty],
    queryFn: async () => {
      let query = supabase
        .from('tutorials')
        .select('*')
        .eq('language', language)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (category) {
        query = query.eq('category_id', category);
      }

      if (difficulty) {
        query = query.eq('difficulty_level', difficulty);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getDifficultyBadge = (level: string) => {
    const colors = {
      débutant: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermédiaire: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      avancé: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[level as keyof typeof colors]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'fr' ? 'Tutoriels' : language === 'en' ? 'Tutorials' : 'Tutoriais'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {language === 'fr' 
              ? 'Apprenez avec nos tutoriels détaillés' 
              : language === 'en' 
                ? 'Learn with our detailed tutorials'
                : 'Aprenda com nossos tutoriais detalhados'}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <select 
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm"
            value={difficulty || ''}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set('difficulty', e.target.value);
              } else {
                params.delete('difficulty');
              }
              window.location.search = params.toString();
            }}
          >
            <option value="">
              {language === 'fr' ? 'Tous les niveaux' : language === 'en' ? 'All levels' : 'Todos os níveis'}
            </option>
            <option value="débutant">
              {language === 'fr' ? 'Débutant' : language === 'en' ? 'Beginner' : 'Iniciante'}
            </option>
            <option value="intermédiaire">
              {language === 'fr' ? 'Intermédiaire' : language === 'en' ? 'Intermediate' : 'Intermediário'}
            </option>
            <option value="avancé">
              {language === 'fr' ? 'Avancé' : language === 'en' ? 'Advanced' : 'Avançado'}
            </option>
          </select>
        </div>

        <div className="grid gap-8">
          {tutorials?.length ? (
            tutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                to={`/tutorials/${tutorial.slug}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {tutorial.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {tutorial.excerpt}
                    </p>
                    <div className="flex items-center space-x-4">
                      {tutorial.difficulty_level && (
                        <div className="flex items-center">
                          {getDifficultyBadge(tutorial.difficulty_level)}
                        </div>
                      )}
                      {tutorial.estimated_time && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ⏱️ {tutorial.estimated_time} min
                        </span>
                      )}
                    </div>
                  </div>
                  {tutorial.cover_image_url && (
                    <img
                      src={tutorial.cover_image_url}
                      alt={tutorial.title}
                      className="w-32 h-24 object-cover rounded-md ml-4"
                    />
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'fr' 
                  ? 'Aucun tutoriel trouvé.' 
                  : language === 'en' 
                    ? 'No tutorials found.'
                    : 'Nenhum tutorial encontrado.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
