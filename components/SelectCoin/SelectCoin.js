import { useTheme } from "next-themes";
import Select from "react-select";
import { useAppContext } from "../Context/Context";
import { ACTIONS, useCurrentCoin } from "../Context/mainReducer";

const colorsLight = {
  primary50: "#D1D5DB",
};

const colorsDark = {
  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: "#111827",

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

const getThemeColors = (projectTheme) =>
  projectTheme === "light" ? colorsLight : colorsDark;

const getSelectTheme = (theme, projectTheme) => {
  const currentColors = getThemeColors(projectTheme);
  return {
    ...theme,
    borderRadius: 4,
    colors: {
      ...theme.colors,
      ...currentColors,
    },
  };
};

const SelectCoin = () => {
  const { theme: projectTheme } = useTheme();
  const { state, dispatch } = useAppContext();
  const currentCoin = useCurrentCoin();

  const themeColors = getThemeColors(projectTheme);

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
        menu: (provided, state) => ({
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
