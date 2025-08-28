import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { userService, TeamMember } from '../../lib/userService';
import { Users } from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: 'easeOut'
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const getRoleLabel = (role: string) => {
  const roles: Record<string, string> = {
    'admin': 'Administrateur',
    'author': 'Auteur',
    'editor': 'Éditeur',
    'contributor': 'Contributeur'
  };
  return roles[role.toLowerCase()] || role;
};

export const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        const members = await userService.getTeamMembers();
        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'équipe:', err);
        setError('Impossible de charger les membres de l\'équipe. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="animate-pulse h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg">
            Aucun membre d'équipe trouvé.
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="py-16 bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
            <Users className="mr-2 h-4 w-4" />
            Notre équipe
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Rencontrez notre équipe d'experts
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Des professionnels passionnés dédiés à l'excellence éditoriale
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-6"></div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              whileHover={{ y: -5 }}
              variants={fadeInUp}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <img 
                  src={member.avatar_url} 
                  alt={member.display_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.display_name)}&background=random`;
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.display_name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {getRoleLabel(member.role)}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TeamSection;
