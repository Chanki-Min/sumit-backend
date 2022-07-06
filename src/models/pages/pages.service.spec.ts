import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import { PagesService } from './pages.service';

import { onePage, pageArray } from '@src/test-utils/mockData';

describe('PagesService', () => {
  let service: PagesService;
  let repository: Repository<Page>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: getRepositoryToken(Page),
          useValue: {
            create: jest.fn(),
            merge: jest
              .fn()
              .mockImplementation(
                (
                  mergeIntoEntity: Page,
                  ...entityLikes: DeepPartial<Page>[]
                ) => {
                  let merged: any = Object.assign({}, mergeIntoEntity);
                  for (const entityLike of entityLikes) {
                    merged = {
                      ...merged,
                      ...entityLike,
                    };
                  }
                  return merged;
                },
              ),
            find: jest.fn().mockResolvedValue(pageArray),
            findOne: jest.fn().mockResolvedValue(onePage),
            save: jest.fn().mockResolvedValue(onePage),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PagesService>(PagesService);
    repository = module.get<Repository<Page>>(getRepositoryToken(Page));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should save insert page', async () => {
      const username = 'ck';
      const pageToInsert: CreatePageDto = {
        title: 'title#1',
        description: 'desc#1',
        share: false,
        hashtags: [],
      };

      const createRes = await service.create(username, pageToInsert);
      expect(createRes).toEqual(onePage);
    });
  });

  describe('findAll()', () => {
    it('should find by user id', async () => {
      const userIdToFind = 'ck';
      const findRes = await service.findAll(userIdToFind);

      expect(findRes.every((p) => p.user_uuid === userIdToFind)).toBe(true);
    });
  });

  describe('findOne()', () => {
    it('should find by user id and page id', async () => {
      const userIdToFind = 'ck';
      const pageIdToFind = '1';
      const findRes = await service.findOne(userIdToFind, pageIdToFind);

      expect(findRes).toEqual(onePage);
    });
  });

  describe('update()', () => {
    it('should call save() with updated entiry', async () => {
      const userId = 'ck';
      const pageIdToUpdate = '1';
      const updateDto: UpdatePageDto = {
        title: 'title#2',
      };

      await service.update(userId, pageIdToUpdate, updateDto);

      expect(repository.save).toBeCalledWith({
        ...onePage,
        ...updateDto,
      });
    });
  });

  describe('remove()', () => {
    it('should call remove() with updated entiry', async () => {
      const userId = 'ck';
      const pageIdToDelete = '1';

      await service.remove(userId, pageIdToDelete);

      expect(repository.remove).toBeCalledWith(onePage);
    });
  });
});
