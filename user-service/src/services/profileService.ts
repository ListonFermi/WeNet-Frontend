import { Types } from "mongoose";
import { IUser } from "../models/User";
import profileRepository from "../repositories/profileRepository";
import { MQActions, SERVICES } from "../rabbitMq/config";
import userService from "./userService";

export = {
  getUserData: async (_id: string | Types.ObjectId): Promise<IUser> => {
    try {
      return await profileRepository.getUserData(_id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  editUserData: async (
    _id: string | Types.ObjectId,
    userData: IUser
  ): Promise<IUser> => {
    try {
      return profileRepository.editUserData(_id, userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  generateJWT: async (userData: IUser): Promise<string> => {
    try {
      return await profileRepository.generateJWT(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  uploadImage: async (
    imageFile: unknown,
    imageType: string
  ): Promise<string> => {
    try {
      return await profileRepository.uploadImage(imageFile, imageType);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getProfileData: async (username: string): Promise<IUser> => {
    try {
      return profileRepository.getProfileData(username);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  toggleFollow: async (
    currentUserId: string,
    userToFollow: string
  ): Promise<boolean> => {
    try {
      const isFollowing = await profileRepository.toggleFollow(
        currentUserId,
        userToFollow
      );

      if (isFollowing) {
        try {
          SERVICES.notification.forEach(async () => {
            await profileRepository.sendNotificationToMQ(
              userToFollow,
              currentUserId,
              "follow",
              "Started following you",
              "users",
              currentUserId
            );
          });
        } catch (error: any) {
          console.log(error.message);
        }
      }

      return isFollowing;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  isFollowing: async (
    currentUserId: string,
    userToFollow: string
  ): Promise<boolean> => {
    try {
      return await profileRepository.isFollowing(currentUserId, userToFollow);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
