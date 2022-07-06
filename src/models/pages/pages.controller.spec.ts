import { Test, TestingModule } from '@nestjs/testing';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

import { AuthzUser } from '@src/decorators/user.decorator';
import { onePage, pageArray } from '@src/test-utils/mockData';

describe('PagesContorller', () => {
  let controller: PagesController;
  let service: PagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [
        PagesService,
        {
          provide: PagesService,
          useValue: {
            create: jest.fn().mockResolvedValue(onePage),
            findAll: jest.fn().mockResolvedValue(pageArray),
            findOne: jest.fn().mockResolvedValue(onePage),
            update: jest
              .fn()
              .mockImplementation(
                (_u: unknown, _p: unknown, updateDto: UpdatePageDto) => {
                  return {
                    ...onePage,
                    ...updateDto,
                  };
                },
              ),
            remove: jest.fn().mockResolvedValue(onePage),
          },
        },
      ],
    }).compile();

    controller = module.get(PagesController);
    service = module.get(PagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create page', async () => {
      const createDto: CreatePageDto = {
        title: 'title#1',
        description: 'desc#1',
      };
      const createRes = await controller.create(
        { sub: '1' } as AuthzUser,
        createDto,
      );

      expect(createRes).toEqual(onePage);
    });
  });

  describe('findAllByUser()', () => {
    it('should find all page of one user', async () => {
      const user: Partial<AuthzUser> = {
        sub: 'ck',
      };

      const findRes = await controller.findAllByUser(user as AuthzUser);
      expect(findRes.every((p) => p.user_uuid === user.sub)).toBe(true);
    });
  });

  describe('findOne()', () => {
    it('should find one page of one user', async () => {
      const user: Partial<AuthzUser> = {
        sub: 'ck',
      };
      const pageId = '1';

      const findRes = await controller.findOne(user as AuthzUser, pageId);
      expect(findRes.user_uuid).toBe(user.sub);
      expect(findRes.uuid).toBe(pageId);
    });
  });

  describe('update()', () => {
    it('should return merged page as resut', async () => {
      const user: Partial<AuthzUser> = {
        sub: 'ck',
      };
      const pageId = '1';
      const updateDto: UpdatePageDto = {
        title: 'title#2',
      };

      const updateRes = await controller.update(
        user as AuthzUser,
        pageId,
        updateDto,
      );

      expect(updateRes).toEqual({ ...onePage, ...updateRes });
    });

    describe('remove()', () => {
      it('should call remove service', async () => {
        const user: Partial<AuthzUser> = {
          sub: 'ck',
        };
        const pageId = '1';

        await controller.remove(user as AuthzUser, pageId);
        expect(service.remove).toHaveBeenCalledWith(user.sub, pageId);
      });
    });
  });
});
