-- Fix RLS Policy for public.members table
-- Remove the insecure policy and create secure ones

-- First, drop the existing insecure policy
DROP POLICY IF EXISTS "Anyone can delete member" ON public.members;

-- Create secure policies for different operations

-- 1. Allow authenticated users to read their own member data
CREATE POLICY "Users can view own member data" ON public.members
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. Allow authenticated users to insert their own member data
CREATE POLICY "Users can insert own member data" ON public.members
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Allow authenticated users to update their own member data
CREATE POLICY "Users can update own member data" ON public.members
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Restrict DELETE access - only allow users to delete their own data
CREATE POLICY "Users can delete own member data" ON public.members
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. Optional: Allow admin users to manage all member data
CREATE POLICY "Admins can manage all members" ON public.members
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Ensure RLS is enabled on the table
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.members TO authenticated;
REVOKE ALL ON public.members FROM anon;
