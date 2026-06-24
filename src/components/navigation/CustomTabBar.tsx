

  import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
  import { StyleSheet, TouchableOpacity, View } from "react-native";
  import { SansText } from "../reusable/Text/SansText";
  import { IconName, ICONS } from "../../assets/svg";

  export function CustomTabBar({
    state,
    descriptors,
    navigation,
  }: BottomTabBarProps) {
     const activeRoute = state.routes[state.index];
  const activeOptions = descriptors[activeRoute.key].options as any;
  const isHidden = activeOptions?.tabBarStyle?.display === "none";

      if (isHidden) return null;
    return (
      <View style={styles.container}>
        

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const tabIcon = (options as any)?.tabIcon as {
            active: IconName;
            inactive: IconName;
          };

          const iconKey = isFocused
            ? tabIcon?.active
            : tabIcon?.inactive;

          const IconComponent = ICONS[iconKey];

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabBtn}
              activeOpacity={0.8}
            >
              {/* SVG Icon */}
              {IconComponent && <IconComponent width={24} height={24} />}

              {/* Label */}
              <SansText
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: isFocused ? "#816B22" : "#4A4A4A",
                  fontFamily: isFocused ? "GeneralSans-Medium" : "GeneralSans-Regular",
                }}
              >
                {options.title}
              </SansText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      height: 68,
      backgroundColor: "#FBF7EB",
      justifyContent: "space-around",
      alignItems:"flex-start",
      borderColor:"#EDDEAD",
      borderTopWidth:1,
      borderRightWidth:1,
      borderLeftWidth:1,
      borderTopRightRadius:12,
      borderTopLeftRadius:12,
      paddingTop:8
    },

    topShadow: {
      position: "absolute",
      top: -35,
      left: 0,
      right: 0,
      height: 36,
    },

    tabBtn: {
      flex: 1,
      alignItems: "center",
      gap: 2,
    },
  });