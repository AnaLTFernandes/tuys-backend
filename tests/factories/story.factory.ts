import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";

function createStory(userId: number) {
  return prisma.channels.create({
    data: {
      name: faker.lorem.word(7),
      background: faker.image.abstract(),
      Stories: {
        create: {
          title: faker.lorem.word(10),
          body: faker.lorem.paragraph(),
          userId,
        },
      },
    },
    include: {
      Stories: {
        include: { Users: true },
      },
    },
  });
}

function createStoryOfChannel(userId: number, channelId: number) {
  return prisma.stories.create({
    data: {
      title: faker.lorem.word(10),
      body: faker.lorem.paragraph(),
      userId,
      channelId,
    },
    include: { Users: true },
  });
}

export { createStory, createStoryOfChannel };