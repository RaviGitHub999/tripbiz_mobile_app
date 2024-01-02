import { useState, useEffect, useRef } from "react";
import {Dimensions, PixelRatio,ScaledSize} from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const getWidth: (widthPercent: string | number) => number = widthPercent => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const getHeigth: (heightPercent: string | number) => number = heightPercent => {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export const getFontSize = (fontSize: number) => {
  const widthDimension =
    screenHeight > screenWidth ? screenWidth : screenHeight;
  const aspectRatioBasedHeight = (16 / 9) * widthDimension;
  return (
    (Math.sqrt(
      Math.pow(aspectRatioBasedHeight, 2) + Math.pow(widthDimension, 2),
    ) *
      (fontSize / 100)) /
    2
  );
};

let subscribe: any;
const listenOrientationChange = (that: any) => {
  let subscribe = Dimensions.addEventListener('change', newDimensions => {
    screenWidth = newDimensions.window.width;
    screenHeight = newDimensions.window.height;

    that.setState({
      orientation: screenWidth < screenHeight ? 'portrait' : 'landscape',
    });
  });
};

const removeOrientationListener = () => {
  subscribe.remove();
};

export {
  getWidth,
  getHeigth,
  listenOrientationChange,
  removeOrientationListener,
};




/////
// React  native responsive dimensions
const useDimensionsListener = () => {
  const [screenDimension, setScreenDimension] = useState(
    Dimensions.get("screen")
  );
  const [windowDimension, setWindowDimension] = useState(
    Dimensions.get("window")
  );

  useEffect(() => {
    function handleDimensionChange({
      window,
      screen
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) {
      setWindowDimension(window);
      setScreenDimension(screen);
    }

    // Dimensions.addEventListener("change", handleDimensionChange);
    const listener = Dimensions.addEventListener("change", handleDimensionChange);


    return () => {
      // Dimensions.removeEventListener("change", handleDimensionChange);
      listener.remove()
    };
  }, []);

  return {
    screen: screenDimension,
    window: windowDimension
  };
};

type EffectParams = {
  screen: ScaledSize;
  window: ScaledSize;
};

type EffectCallback =
  | ((opts: EffectParams) => () => any)
  | ((opts: EffectParams) => undefined)
  | ((opts: EffectParams) => void);

const percentageCalculation = (max: number, val: number) => max * (val / 100);

const fontCalculation = (height: number, width: number, val: number) => {
  const widthDimension = height > width ? width : height;
  const aspectRatioBasedHeight = (16 / 9) * widthDimension;
  return percentageCalculation(
    Math.sqrt(
      Math.pow(aspectRatioBasedHeight, 2) + Math.pow(widthDimension, 2)
    ),
    val
  );
};

export const useDimensionsChange = (effect: EffectCallback) => {
  const hasMountRef = useRef(false);
  const dimensions = useDimensionsListener();

  useEffect(() => {
    if (hasMountRef.current) {
      const destroy = effect(dimensions);
      let cleanUp: any = () => null;
      if (typeof destroy === "function") {
        cleanUp = destroy;
      }
      return () => cleanUp();
    } else {
      hasMountRef.current = true;
    }
  }, [dimensions, effect]);
};

export const responsiveHeight = (h: number) => {
  const { height } = Dimensions.get("window");
  return percentageCalculation(height, h);
};

export const responsiveWidth = (w: number) => {
  const { width } = Dimensions.get("window");
  return percentageCalculation(width, w);
};

export const responsiveFontSize = (f: number) => {
  const { height, width } = Dimensions.get("window");
  return fontCalculation(height, width, f);
};

export const responsiveScreenHeight = (h: number) => {
  const { height } = Dimensions.get("screen");
  return percentageCalculation(height, h);
};

export const responsiveScreenWidth = (w: number) => {
  const { width } = Dimensions.get("screen");
  return percentageCalculation(width, w);
};

export const responsiveScreenFontSize = (f: number) => {
  const { height, width } = Dimensions.get("screen");
  return fontCalculation(height, width, f);
};

export const useResponsiveHeight = (h: number) => {
  const { height } = useDimensionsListener().window;
  return percentageCalculation(height, h);
};

export const useResponsiveWidth = (w: number) => {
  const { width } = useDimensionsListener().window;
  return percentageCalculation(width, w);
};

export const useResponsiveFontSize = (f: number) => {
  const { height, width } = useDimensionsListener().window;
  return fontCalculation(height, width, f);
};

export const useResponsiveScreenHeight = (h: number) => {
  const { height } = useDimensionsListener().screen;
  return percentageCalculation(height, h);
};

export const useResponsiveScreenWidth = (w: number) => {
  const { width } = useDimensionsListener().screen;
  return percentageCalculation(width, w);
};

export const useResponsiveScreenFontSize = (f: number) => {
  const { height, width } = useDimensionsListener().screen;
  return fontCalculation(height, width, f);
};

