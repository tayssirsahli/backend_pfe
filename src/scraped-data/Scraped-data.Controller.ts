import { SupabaseClient } from '@supabase/supabase-js';
import { Controller, Get, Param, Post, Body, Put, Delete, Req, UseGuards, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ScrapedDataService } from './scraped_data.service';
import { AuthentificationService } from 'src/authentification/authentification.service'; // Import the service
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('scraped-data')
export class ScrapedDataController {
  private supabase;
  constructor(
    private readonly scrapedDataService: ScrapedDataService,
    private readonly authService: AuthentificationService, private readonly supabaseService: SupabaseService
  ) {
    this.supabase = this.supabaseService.getClient();

  }

  // Route to get all scraped data
  @Get()
  async getAllScrapedData() {
    return this.scrapedDataService.getAllScrapedData();
  }


  // Route to get specific entry by ID
 /*  @Get(':id')
  async getScrapedDataById(@Param('id') id: string) {
    return this.scrapedDataService.getScrapedDataById(Number(id));
  } */

  @Post('add')
  async addScrapedData(
    @Body() newData: {
      author: string;
      selected_text: string;
      image_url: string;
      comments: string;
      hashtags: string,
      title: string,
      platform: string,
    }[],
  ) {
    try {
      // Récupérer l'utilisateur authentifié via Supabase
      const { data, error } = await this.supabase.auth.getSession();

      if (error || !data?.session) {
        throw new HttpException(
          { message: "No active session found", details: "Auth session missing!" },
          HttpStatus.UNAUTHORIZED
        );
      }

      const user = data.session.user;

      if (!user || !user.id) {
        throw new HttpException(
          { message: "No authenticated user found", details: "User not authenticated!" },
          HttpStatus.UNAUTHORIZED
        );
      }

      // Associer les données à l'utilisateur
      const dataToInsert = newData.map((data) => ({
        ...data,
        id_user: user.id, // Supabase stocke les IDs sous forme de string
      }));

      return await this.scrapedDataService.addScrapedData(dataToInsert);
    } catch (error) {
      throw new HttpException(
        { message: "Failed to add scraped data", details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Route to update an existing entry
  @Put(':id')
  async updateScrapedData(
    @Param('id') id: string,
    @Body() updatedData: {
      author?: string;
      selected_text?: string;
      image_url?: string;
      comments?: string;
    }
  ) {
    return this.scrapedDataService.updateScrapedData(Number(id), updatedData);
  }

  // Route to delete an entry
  @Delete(':id')
  async deleteScrapedData(@Param('id') id: string) {
    console.log("Received ID for deletion:", id); // Debugging

    if (!id || id === 'NaN') {
      throw new Error("Invalid ID: " + id);
    }
    return this.scrapedDataService.deleteScrapedData(id);
  }


  @Get('count')
  async getCount(): Promise<number> {
    return this.scrapedDataService.count();
  }
}
