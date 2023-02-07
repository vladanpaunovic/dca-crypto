"use client";

import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from "next/navigation";
import Select from "react-select/async";
import { searchCoin } from "../../queries/queries";
import { useStore } from "../../src/store/store";

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
  const availableTokens = useStore((state) => state.availableTokens);
  const searchParams = useSearchParams();
  // const currentCoin = state.currentCoin;
  const themeColors = colorsLight;
  const router = useRouter();

  const handleOnChange = async (e) => {
    const url = `/dca/${e.value}?${searchParams.toString()}`;
    console.log("Navigating to:", url);
    return router.push(url);
  };

  if (!availableTokens) {
    return null;
  }

  const options = parseOptions(availableTokens);

  // const currentCoin = availableTokens.find(
  //   (token) => token.id === state.input.coinId
  // );

  // const defaultValue = parseOptions([currentCoin])[0];
  const defaultValue = null;

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
