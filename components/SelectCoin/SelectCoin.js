import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useAppContext } from "../Context/Context";
import { ACTIONS } from "../Context/mainReducer";

const colorsLight = {
  primary50: "#D1D5DB",
  neutral0: "white",
};

const colorsDark = {
  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: "#1F2937",

  /*
   * control/backgroundColor(disabled)
   */
  neutral5: "#6B7280",

  /*
   * control/borderColor(disabled)
   * multiValue/backgroundColor
   * indicators(separator)/backgroundColor(disabled)
   */
  neutral10: "#6B7280",

  /*
   * control/borderColor
   * option/color(disabled)
   * indicators/color
   * indicators(separator)/backgroundColor
   * indicators(loading)/color
   */
  neutral20: "#374151",

  /*
   * control/borderColor(focused)
   * control/borderColor:hover
   */
  neutral30: "#374151",

  /*
   * menu(notice)/color
   * singleValue/color(disabled)
   * indicators/color:hover
   */
  neutral40: "#374151",

  /*
   * placeholder/color
   */
  neutral50: "#F3F4F6",

  /*
   * indicators/color(focused)
   * indicators(loading)/color(focused)
   */
  neutral60: "#F3F4F6",

  neutral70: "#F3F4F6",

  /*
   * input/color
   * multiValue(label)/color
   * singleValue/color
   * indicators/color(focused)
   * indicators/color:hover(focused)
   */
  neutral80: "#F3F4F6",

  neutral90: "#F3F4F6",

  /*
   * control/boxShadow(focused)
   * control/borderColor(focused)
   * control/borderColor:hover(focused)
   * option/backgroundColor(selected)
   * option/backgroundColor:active(selected)
   */
  primary: "#6B7280",

  /*
   * option/backgroundColor(focused)
   */
  primary25: "#374151",

  /*
   * option/backgroundColor:active
   */
  primary50: "#374151",

  primary75: "#374151",
};

export const getThemeColors = (projectTheme) => {
  return projectTheme === "light" ? colorsLight : colorsDark;
};

export const getSelectTheme = (theme, projectTheme) => {
  const currentColors = getThemeColors(projectTheme);
  const output = {
    ...theme,
    borderRadius: 4,
    colors: {
      ...theme.colors,
      ...currentColors,
    },
  };

  return output;
};

const SelectCoin = () => {
  const { theme: projectTheme } = useTheme();
  const { state, dispatch } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const currentCoin = state.currentCoin;
  const themeColors = getThemeColors(projectTheme);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!state.settings.availableTokens) {
    return null;
  }

  const options = state.settings.availableTokens.map((coin) => ({
    label: coin.name,
    value: coin.id,
  }));

  return (
    <Select
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
        control: (base) => ({
          ...base,
          backgroundColor: themeColors.neutral0,
        }),
        menu: (provided) => ({
          ...provided,
          border: "1px solid",
          borderColor: themeColors.primary50,
        }),
      }}
      theme={(theme) => getSelectTheme(theme, projectTheme)}
      className="w-full"
      classNamePrefix="select"
      defaultValue={{
        label: currentCoin.name,
        value: currentCoin.id,
      }}
      isSearchable
      name="coin"
      options={options}
      onChange={(e) => {
        dispatch({
          type: ACTIONS.UPDATE_COIN_ID,
          payload: e.value,
        });
      }}
      maxMenuHeight={200}
    />
  );
};

export default SelectCoin;
