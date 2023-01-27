import supertest from "supertest";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { UserStatus } from "@prisma/client";
import server from "../../src/server";
import { generateValidToken, generateValidUser } from "../helpers/generateValidData";
import { createStory, createFollow } from "../factories";
import { cleanDatabase } from "../helpers/cleanDatabase";

const app = supertest(server);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("GET /users/me", () => {
  const route = "/users/me";

  it("should return status 401 when no token is sent", async () => {
    const response = await app.get(route);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return status 401 when token is invalid", async () => {
    const authorization = `Bearer ${faker.lorem.word()}`;
    const response = await app.get(route).set("Authorization", authorization);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should return status 401 if there is no active session for the user", async () => {
      const { id } = await generateValidUser();
      const token = jwt.sign({ user: id }, process.env.JWT_SECRET || "");
      const authorization = `Bearer ${token}`;

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return 200 and an stories array", async () => {
      const user = await generateValidUser();
      await createStory(user.id);
      const otherUser = await generateValidUser();
      await createFollow({ followedId: user.id, followerId: otherUser.id });
      const authorization = await generateValidToken(user);

      const response = await app.get(route).set("Authorization", authorization);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        username: user.username,
        avatar: user.avatar,
        about: user.about,
        status: UserStatus.ACTIVE,
        rankName: expect.any(String),
        rankColor: expect.any(String),
        bannedStories: 0,
        createdStories: 1,
        followers: 1,
        following: 0,
      });
    });
  });
});