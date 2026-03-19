import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
// Replace these with your actual keys from Supabase Dashboard -> Settings -> API
const supabaseUrl = 'https://ntmbkkxmjekuppqxqxdl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWJra3htamVrdXBwcXhxeGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjEzNjIsImV4cCI6MjA4OTQ5NzM2Mn0.HtZDsdFRBN3wS4EKA7VAIjS79lB9Y1Vgg97R9e0-HKU';

export const supabase = createClient(supabaseUrl, supabaseKey);
