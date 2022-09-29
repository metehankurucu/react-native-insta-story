import { IUser } from './IUser';

export interface IUserStory extends IUser {
    stories: IUserStoryItem[]
}

export interface IUserStoryItem {
    story_id: number,
    story_image: string,
    onPress?: any,
    swipeText?: string,
}
