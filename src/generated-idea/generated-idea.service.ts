import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/supabase/supabase.service';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';  // Pour générer un nom unique pour chaque fichier 
import * as fs from 'fs';


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



    private readonly uploadDir = path.join(__dirname, '../../uploads'); // Le chemin relatif du dossier des uploads


    async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
        // Vérifier si le dossier uploads existe, sinon le créer
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }

        // Générer un nom de fichier unique pour éviter les conflits
        const fileExtension = path.extname(file.originalname);  // Obtient l'extension du fichier (ex: .png)
        const fileName = crypto.randomBytes(16).toString('hex') + fileExtension;  // Génère un nom unique

        // Sauvegarder le fichier sur le serveur
        const filePath = path.join(this.uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);  // Sauvegarder le fichier en utilisant le buffer
        console.log(filePath);
        // Retourner l'URL du fichier sauvegardé
        const imageUrl = `/uploads/${fileName}`;
        console.log(imageUrl);
        return { url: imageUrl };
    }
}
