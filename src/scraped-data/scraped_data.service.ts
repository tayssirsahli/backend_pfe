import { Injectable } from '@nestjs/common';// Importer le service Supabase
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ScrapedDataService {
    private supabase: SupabaseClient;

    constructor(private readonly supabaseService: SupabaseService) {
        this.supabase = this.supabaseService.getClient();
    }

    // Fonction pour récupérer toutes les données de la table scraped_data
    async getAllScrapedData() {
        const { data, error } = await this.supabase
            .from('scraped_data') // Nom de la table
            .select('*'); // Récupérer toutes les colonnes

        if (error) {
            throw new Error(error.message); // Gestion des erreurs
        }

        return data; // Retourne les données récupérées
    }

    // Fonction pour récupérer une entrée spécifique par ID
    async getScrapedDataById(id: number) {
        const { data, error } = await this.supabase
            .from('scraped_data')
            .select('*')
            .eq('id', id) // Recherche par ID
            .single(); // Récupère une seule ligne

        if (error) {
            throw new Error(error.message);
        }

        return data; // Retourne la donnée récupérée
    }

    // Fonction pour ajouter une nouvelle entrée dans la table
    async addScrapedData(newData: {
        author: string;
        selected_text: string;
        image_url: string;
        comments: string;
        id_user: number;
        hashtags: string;
        title: string;
        platform: string;

      }[]) {
        const { data, error } = await this.supabase
          .from('scraped_data')
          .insert(newData); // Insert multiple rows
      
        if (error) {
          throw new Error(error.message);
        }
      
        return data;
      }

    // Fonction pour mettre à jour une entrée existante
    async updateScrapedData(id: number, updatedData: {
        author?: string;
        selected_text?: string;
        image_url?: string;
        comments?: string;
    }) {
        const { data, error } = await this.supabase
            .from('scraped_data')
            .update(updatedData) // Met à jour les données spécifiées
            .eq('id', id); // Filtrer par ID

        if (error) {
            throw new Error(error.message);
        }

        return data; // Retourne les données mises à jour
    }

    // Fonction pour supprimer une entrée
    async deleteScrapedData(id: String) {
        const { data, error } = await this.supabase
            .from('scraped_data')
            .delete()
            .match({ id });

        if (error) {
            throw new Error(error.message);
        }

        return data; 
    }

    // Fonction pour filtrer par author
    async getScrapedDataByAuthor(author: string) {
        const { data, error } = await this.supabase
            .from('scraped_data')
            .select('*')
            .eq('author', author); // Filtrer par auteur

        if (error) {
            throw new Error(error.message);
        }

        return data; // Retourne les données filtrées
    }

    // Fonction pour trier les données par created_at (date de création)
    async getScrapedDataSorted() {
        const { data, error } = await this.supabase
            .from('scraped_data')
            .select('*')
            .order('created_at', { ascending: false }); // Tri décroissant par date

        if (error) {
            throw new Error(error.message);
        }

        return data; // Retourne les données triées
    }
}