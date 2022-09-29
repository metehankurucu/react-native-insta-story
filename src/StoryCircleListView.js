import React, {Component} from "react";
import {View, FlatList} from "react-native";
import StoryCircleListItem from "./StoryCircleListItem";

class StoryCircleListView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            data,
            handleStoryItemPress,
            unPressedBorderColor,
            pressedBorderColor,
            avatarSize,
            renderCreateButton,
            currentUser,
            onCreate
        } = this.props;

        const _data = data?.filter(item => String(item?.user_id) !== String(currentUser?.user_id)) || [];
        const currentUserStories = data.filter(item => item?.user_id == currentUser?.user_id)?.[0]?.stories || [];
        const currentUserData = {
            ...currentUser,
            stories: currentUserStories 
        };

        return (
            <View>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={_data}
                    horizontal
                    style={{paddingLeft: 12}}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={<View style={{flex: 1, width: 8}}/>}
                    ListHeaderComponent={ 
                        <StoryCircleListItem
                            avatarSize={avatarSize}
                            handleStoryItemPress={() => {
                                currentUserStories.length > 0 ? handleStoryItemPress(currentUserData, 0) : onCreate();
                            }}
                            unPressedBorderColor={unPressedBorderColor}
                            pressedBorderColor={pressedBorderColor}
                            item={currentUserData}
                            renderCreateButton={renderCreateButton}
                            currentUserId={currentUser.user_id}
                        />
                    }
                    renderItem={({item, index}) => {
                    return (
                        <StoryCircleListItem
                            avatarSize={avatarSize}
                            handleStoryItemPress={() =>
                                handleStoryItemPress && handleStoryItemPress(item, index)
                            }
                            unPressedBorderColor={unPressedBorderColor}
                            pressedBorderColor={pressedBorderColor}
                            item={item}
                        />
                    )}}
                />
            </View>
        );
    }
}

export default StoryCircleListView;
