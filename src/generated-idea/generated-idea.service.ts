import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class GeneratedIdeaService {
  private supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async createGeneratedIdea(userId: string, generatedText: string) {
    const { data, error } = await this.supabase
      .from('generated_idea')
      .insert([{ user_id: userId, generated_text: generatedText }])
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getGeneratedIdeas() {
    const { data, error } = await this.supabase
      .from('generated_idea')
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  async count(): Promise<number> {
    const { count, error } = await this.supabase
      .from('generated_idea')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Erreur lors du comptage des idées générées : ${error.message}`);
    }

    return count ?? 0;
  }
}
