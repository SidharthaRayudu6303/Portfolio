import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { verifiedPortfolioData } from './portfolio-knowledge';

describe('AiService', () => {
  let service: AiService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue(null), // simulate offline mode (no API key)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    service.onModuleInit();
  });

  it('should fall back to verified local knowledge when asked about skills', async () => {
    const result = await service.ask('What skills or stack does Sidhartha use?');
    expect(result.source).toBe('local_fallback');
    expect(result.text).toContain('TypeScript');
    expect(result.text).toContain('Next.js 16');
  });

  it('should fall back to verified local knowledge when asked about projects', async () => {
    const result = await service.ask('Tell me about your projects');
    expect(result.source).toBe('local_fallback');
    expect(result.text).toContain('Interactive 3D Portfolio');
  });

  it('should answer contact inquiries safely via local fallback', async () => {
    const result = await service.ask('How can I contact or hire you?');
    expect(result.source).toBe('local_fallback');
    expect(result.text).toContain('Contact form');
  });

  it('should handle empty or whitespace prompts safely', async () => {
    const result = await service.ask('   ');
    expect(result.source).toBe('local_fallback');
    expect(result.text).toBe('Please provide a valid question.');
  });
});
