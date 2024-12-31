import supabase from "../supabase";


export const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: '/activity'
      });

      if (error) throw error;

      console.log('Redirecting to Google for authentication...');
    } catch (error) {
      console.error('Error with Google sign-in:', error.message);
    }
  };