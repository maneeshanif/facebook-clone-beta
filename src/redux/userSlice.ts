import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase/client';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
}

interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create one from auth data
        const userData = session.user.user_metadata || {};

        return {
          id: session.user.id,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          full_name: userData.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar_url: null,
          bio: null,
        };
      }

      return data;
    } catch {
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<Profile>, { getState, rejectWithValue }) => {
    try {
      const { user } = getState() as { user: UserState };

      if (!user.profile) {
        return rejectWithValue('No user profile to update');
      }

      // Update user metadata in auth
      await supabase.auth.updateUser({
        data: {
          first_name: updates.first_name,
          last_name: updates.last_name,
          full_name: updates.full_name,
        }
      });

      // Update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.profile.id,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        return rejectWithValue(error.message);
      }

      return { ...user.profile, ...updates };
    } catch {
      return rejectWithValue('Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<Profile | null>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
