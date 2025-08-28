import { supabase } from './supabase';
import { User } from './supabase';

export interface TeamMember extends Pick<User, 'id' | 'display_name' | 'avatar_url' | 'bio'> {
  role: string;
}

export const userService = {
  /**
   * Récupère les membres de l'équipe (utilisateurs avec un rôle)
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          avatar_url,
          bio,
          user_roles (
            role:roles (
              name
            )
          )
        `)
        .or('status.eq.active,status.is.null')
        .not('user_roles.role.name', 'is', null);

      if (error) throw error;

      // Transformer les données pour inclure le rôle principal
      return (data || [])
        .map(user => {
          // Type assertion pour accéder aux propriétés imbriquées
          const userData = user as any;
          const role = Array.isArray(userData.user_roles) && userData.user_roles.length > 0 
            ? userData.user_roles[0]?.role?.name || 'Membre'
            : 'Membre';
            
          return {
            id: user.id,
            display_name: user.display_name || 'Anonyme',
            avatar_url: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.display_name || 'U')}&background=random`,
            bio: user.bio || 'Membre de l\'équipe',
            role: role
          };
        })
        // Filtrer pour exclure les rôles 'Administrateur' et 'super_admin'
        .filter(member => {
          const lowerRole = member.role.toLowerCase();
          return lowerRole !== 'admin' && lowerRole !== 'super_admin';
        });
    } catch (error) {
      console.error('Erreur lors de la récupération des membres de l\'équipe:', error);
      return [];
    }
  },

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }
};
