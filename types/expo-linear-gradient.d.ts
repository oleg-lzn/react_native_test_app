declare module "expo-linear-gradient" {
  import { Component } from "react";
  import { ViewStyle } from "react-native";

  export interface LinearGradientProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  export class LinearGradient extends Component<LinearGradientProps> {}
}
