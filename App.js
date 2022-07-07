import React, { useRef, useState } from "react";
import { Animated, Easing, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from './icons';


const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const BLUE = "#42bff5";
const RED = "#f5425a";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 200px;
  height: 70px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`;

const Word = styled.Text`
  font-size: 40px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
const Center = styled.View`
  flex: 2;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  z-index: 10;
  position: absolute;
`;

export default function App() {
  // Values
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleEdgeTop = position.y.interpolate({
    inputRange: [-280, -80],
    outputRange: [1.5, 1],
    extrapolate: "clamp",
  });
  const scaleEdgeBottom = position.y.interpolate({
    inputRange: [80, 280],
    outputRange: [1, 1.5],
    extrapolate: "clamp",
  });
  // Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    useNativeDriver: true,
    easing: Easing.linear,
    duration: 100,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    easing: Easing.linear,
    duration: 100,
    useNativeDriver: true,
  })
  const goCenter = Animated.timing(position, {
    toValue: 0,
    duration: 100,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const onNextScale = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onNextOpacity = Animated.spring(opacity, {
    toValue: 1,
    useNativeDriver: true,
  });
  // Pan Responders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -250 || dy > 250) {
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            goCenter
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
    })
  ).current;
  // State
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      onNextScale, onNextOpacity
    ]).start();
  }
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleEdgeTop }] }}>
          <Word color={BLUE}>😍</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GREY} size={70} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleEdgeBottom }] }}>
          <Word color={RED}>😫</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
