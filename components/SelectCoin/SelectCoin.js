import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Select from "react-select/async";
import { getCoinById, searchCoin } from "../../queries/queries";
import { useAppContext } from "../Context/Context";
import { ACTIONS } from "../Context/mainReducer";

const colorsLight = {
  primary50: "#D1D5DB",
  neutral0: "white",
};

export const getSelectTheme = (theme) => {
  const currentColors = colorsLight;
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

const parseOptions = (options) =>
  options.map((option) => ({
    ...option,
    value: option.id,
    label: (
      <span className="flex items-center">
        <span className="text-xs text-gray-300 mr-2">
          #{option.market_cap_rank}
        </span>{" "}
        <span className="text-gray-900 ">{option.name}</span>
      </span>
    ),
  }));

const promiseOptions = async (inputValue) => {
  const coins = await searchCoin(inputValue);
  return parseOptions(coins);
};

const SelectCoin = () => {
  const { theme: projectTheme } = useTheme();
  const { state, dispatch } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const currentCoin = state.currentCoin;
  const themeColors = colorsLight;

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const handleOnChange = async (e) => {
    const currentCoin = await getCoinById(e.value);

    dispatch({
      type: ACTIONS.UPDATE_COIN_ID,
      payload: currentCoin,
    });
  };

  if (!mounted) return null;

  if (!state.settings.availableTokens) {
    return null;
  }

  const options = parseOptions(state.settings.availableTokens);

  const defaultValue = parseOptions([currentCoin])[0];

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
      defaultValue={defaultValue}
      isSearchable
      name="coin"
      onChange={handleOnChange}
      maxMenuHeight={200}
      cacheOptions
      loadOptions={promiseOptions}
      defaultOptions={options}
    />
  );
};

export default SelectCoin;
