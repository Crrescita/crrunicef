import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    View,
} from 'react-native';
import { ImageCarouselItem } from '../../types';

const { width } = Dimensions.get('window');

const SPACING = 10;
const ITEM_LENGTH = width * 0.98;
const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2;
const BORDER_RADIUS = 20;

interface ImageCarouselProps {
    data: ImageCarouselItem[];
}

const ImageCarousel: FC<ImageCarouselProps> = ({ data }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [dataWithPlaceholders, setDataWithPlaceholders] = useState<
        ImageCarouselItem[]
    >([]);
    const currentIndex = useRef<number>(0);
    const flatListRef = useRef<FlatList<any>>(null);

    useEffect(() => {
        setDataWithPlaceholders([{ id: -1 }, ...data, { id: data.length }]);
        currentIndex.current = 1;
    }, [data]);

    // `data` perameter is not used. Therefore, it is annotated with the `any` type to merely satisfy the linter.
    const getItemLayout = (_data: any, index: number) => ({
        length: ITEM_LENGTH,
        offset: ITEM_LENGTH * (index - 1),
        index,
    });

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={dataWithPlaceholders}
                renderItem={({ item, index }) => {
                    if (!item?.banner) {
                        return <View style={{ width: EMPTY_ITEM_LENGTH }} />;
                    }
                    return (
                        <View key={item?.id + 'item__'} style={{ width: ITEM_LENGTH }}>
                            <Animated.View
                                style={[styles.itemContent
                                ]}>
                                <Image source={{ uri: item?.banner }} style={styles.itemImage} />
                            </Animated.View>
                        </View>
                    );
                }}
                getItemLayout={getItemLayout}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item?.id}
                bounces={false}
                decelerationRate={0}
                renderToHardwareTextureAndroid
                contentContainerStyle={styles.flatListContent}
                snapToInterval={ITEM_LENGTH}
                snapToAlignment="start"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
                scrollEventThrottle={16}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 100,
                }}
            />
        </View>
    );
};

export default ImageCarousel;

const styles = StyleSheet.create({
    container: {},
    flatListContent: {
        alignItems: 'center',
    },
    item: {},
    itemContent: {
        marginHorizontal: SPACING * 1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: BORDER_RADIUS + SPACING * 2,
    },
    itemImage: {
        width: '100%',
        height: ITEM_LENGTH * 0.7,
        borderRadius: BORDER_RADIUS,
        resizeMode: 'cover',
    },
});