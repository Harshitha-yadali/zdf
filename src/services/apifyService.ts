import { supabase } from '../lib/supabase';
import type {
  JobFetchConfig,
  JobSyncLog,
  ApifySearchConfig,
  ApifyJobData
} from '../types/jobs';

export class ApifyService {
  async getConfigs(): Promise<JobFetchConfig[]> {
    const { data, error } = await supabase
      .from('job_fetch_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getConfigById(id: string): Promise<JobFetchConfig | null> {
    const { data, error } = await supabase
      .from('job_fetch_configs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createConfig(config: Omit<JobFetchConfig, 'id' | 'created_at' | 'updated_at'>): Promise<JobFetchConfig> {
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('job_fetch_configs')
      .insert({
        ...config,
        created_by: userData?.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateConfig(id: string, updates: Partial<JobFetchConfig>): Promise<JobFetchConfig> {
    const { data, error } = await supabase
      .from('job_fetch_configs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteConfig(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_fetch_configs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async toggleConfig(id: string, isActive: boolean): Promise<JobFetchConfig> {
    return this.updateConfig(id, { is_active: isActive });
  }

  async getSyncLogs(configId?: string, limit: number = 50): Promise<JobSyncLog[]> {
    let query = supabase
      .from('job_sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (configId) {
      query = query.eq('config_id', configId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async triggerManualSync(configId: string): Promise<{ success: boolean; message: string }> {
    try {
      const config = await this.getConfigById(configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      if (!config.is_active) {
        throw new Error('Configuration is not active');
      }

      const { data, error } = await supabase.functions.invoke('apify-sync-jobs', {
        body: { configId }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Sync initiated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to trigger sync'
      };
    }
  }

  generateDefaultSearchConfig(platform: string): ApifySearchConfig {
    const configs: Record<string, ApifySearchConfig> = {
      linkedin: {
        keywords: ['software engineer', 'developer'],
        location: 'India',
        jobType: 'Full-time',
        experienceLevel: 'Entry level',
        maxResults: 50
      },
      indeed: {
        keywords: ['software developer'],
        location: 'Remote',
        jobType: 'Full-time',
        maxResults: 50
      },
      naukri: {
        keywords: ['software engineer'],
        location: 'Bangalore',
        experienceLevel: '0-3 years',
        maxResults: 50
      },
      instahyre: {
        keywords: ['backend developer', 'frontend developer'],
        location: 'India',
        maxResults: 50
      }
    };

    return configs[platform.toLowerCase()] || {
      keywords: ['software'],
      location: 'India',
      maxResults: 50
    };
  }

  getPopularActorIds(): Record<string, string> {
    return {
      linkedin: 'apify/linkedin-jobs-scraper',
      indeed: 'apify/indeed-scraper',
      naukri: 'curious_coder/naukri-scraper',
      instahyre: 'apify/instahyre-scraper',
      glassdoor: 'apify/glassdoor-scraper'
    };
  }

  async testApifyConnection(apiToken: string, actorId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`https://api.apify.com/v2/acts/${actorId}`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid API token or Actor ID');
      }

      return {
        success: true,
        message: 'Connection successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async getActiveConfigs(): Promise<JobFetchConfig[]> {
    const { data, error } = await supabase
      .from('job_fetch_configs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getSyncStats(): Promise<{
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    totalJobsFetched: number;
    totalJobsCreated: number;
    lastSyncDate: string | null;
  }> {
    const { data: logs, error } = await supabase
      .from('job_sync_logs')
      .select('*');

    if (error) throw error;

    const stats = {
      totalSyncs: logs?.length || 0,
      successfulSyncs: logs?.filter(l => l.status === 'success').length || 0,
      failedSyncs: logs?.filter(l => l.status === 'failed').length || 0,
      totalJobsFetched: logs?.reduce((sum, l) => sum + (l.jobs_fetched || 0), 0) || 0,
      totalJobsCreated: logs?.reduce((sum, l) => sum + (l.jobs_created || 0), 0) || 0,
      lastSyncDate: logs?.[0]?.created_at || null
    };

    return stats;
  }

  formatSearchConfigForDisplay(config: ApifySearchConfig): string {
    const entries = Object.entries(config)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        const formattedValue = Array.isArray(value) ? value.join(', ') : value;
        return `${formattedKey}: ${formattedValue}`;
      });

    return entries.join(' | ');
  }

  validateSearchConfig(config: ApifySearchConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.keywords || config.keywords.length === 0) {
      errors.push('At least one keyword is required');
    }

    if (config.maxResults && (config.maxResults < 1 || config.maxResults > 1000)) {
      errors.push('Max results must be between 1 and 1000');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const apifyService = new ApifyService();
