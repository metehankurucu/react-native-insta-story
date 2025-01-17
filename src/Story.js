import React, {Fragment, useRef, useState} from "react";
import {LogBox, Dimensions, View, Platform} from "react-native";
import Modal from "react-native-modalbox";
import StoryListItem from "./StoryListItem";
import StoryCircleListView from "./StoryCircleListView";
import {isNullOrWhitespace} from "./helpers/ValidationHelpers";
import type {IUserStory} from "./interfaces/IUserStory";
import type {IUser} from "./interfaces/IUser";
import AndroidCubeEffect from "./AndroidCubeEffect";
import CubeNavigationHorizontal from "./CubeNavigationHorizontal";

type Props = {
    data: IUserStory[],
    style?: any,
    unPressedBorderColor?: string,
    pressedBorderColor?: string,
    onClose?: function,
    onStart?: function,
    duration?: number,
    swipeText?: string,
    customSwipeUpComponent?: any,
    customCloseComponent?: any,
    avatarSize?: number,
    imageStyle?: any,
    renderCreateButton?: any,
    currentUser?: IUser,
    onCreate?: function,
    
};

LogBox.ignoreLogs(['Warning: componentWillReceiveProps']); // Ignore log notification by message

export const Story = (props: Props) => {
    const {
        data,
        unPressedBorderColor,
        pressedBorderColor,
        style,
        onStart,
        onClose,
        duration,
        swipeText,
        customSwipeUpComponent,
        customCloseComponent,
        avatarSize,
        imageStyle,
        renderCreateButton = () => null,
        currentUser,
        onCreate = () => {}
    } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedData, setSelectedData] = useState([]);
    const cube = useRef();

    // Component Functions
    const _handleStoryItemPress = (item, index) => {
        if (onStart) onStart(item);
        setCurrentPage(0);
        setSelectedData([item]);
        setIsModalOpen(true);
    };

    function onStoryFinish(state) {
        if (!isNullOrWhitespace(state)) {
            if (state == "next") {
                const newPage = currentPage + 1;
                if (newPage < selectedData.length) {
                    setCurrentPage(newPage);
                    cube?.current?.scrollTo(newPage);
                } else {
                    setIsModalOpen(false);
                    setCurrentPage(0);
                    if (onClose) {
                        onClose(selectedData[selectedData.length - 1]);
                    }
                }
            } else if (state == "previous") {
                const newPage = currentPage - 1;
                if (newPage < 0) {
                    setIsModalOpen(false);
                    setCurrentPage(0);
                } else {
                    setCurrentPage(newPage);
                    cube?.current?.scrollTo(newPage);
                }
            }
        }
    }

    const renderStoryList = () => selectedData.map((x, i) => {
        return (<StoryListItem duration={duration * 1000}
                               key={i}
                               profileName={x.user_name}
                               profileImage={x.user_image}
                               stories={x.stories}
                               currentPage={currentPage}
                               onFinish={onStoryFinish}
                               swipeText={swipeText}
                               imageStyle={imageStyle}
                               customSwipeUpComponent={customSwipeUpComponent}
                               customCloseComponent={customCloseComponent}
                               onClosePress={() => {
                                   setIsModalOpen(false);
                                   if (onClose) {
                                       onClose(x);
                                   }
                               }}
                               index={i}/>)
    })

    const renderCube = () => {
        if (Platform.OS == 'ios') {
            return (
                <CubeNavigationHorizontal
                    ref={cube}
                    callBackAfterSwipe={(x) => {
                        if (x != currentPage) {
                            setCurrentPage(parseInt(x));
                        }
                    }}
                >
                    {renderStoryList()}
                </CubeNavigationHorizontal>
            )
        } else {
            return (<AndroidCubeEffect
                ref={cube}
                callBackAfterSwipe={(x) => {
                    if (x != currentPage) {
                        setCurrentPage(parseInt(x));
                    }
                }}
            >
                {renderStoryList()}
            </AndroidCubeEffect>)
        }
    }

    return (
        <Fragment>
            <View style={style}>

                <StoryCircleListView
                    handleStoryItemPress={_handleStoryItemPress}
                    data={data}
                    avatarSize={avatarSize}
                    unPressedBorderColor={unPressedBorderColor}
                    pressedBorderColor={pressedBorderColor}
                    renderCreateButton={renderCreateButton}
                    currentUser={currentUser}
                    onCreate={onCreate}
                />
            </View>
            <Modal
                style={{
                    flex: 1,
                    height: Dimensions.get("window").height,
                    width: Dimensions.get("window").width
                }}
                isOpen={isModalOpen}
                onClosed={() => setIsModalOpen(false)}
                position="center"
                swipeToClose
                swipeArea={250}
                backButtonClose
                coverScreen={true}
            >
                {renderCube()}
            </Modal>
        </Fragment>
    );
};
export default Story;
