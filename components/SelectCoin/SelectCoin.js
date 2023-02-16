import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select/async";
import { searchCoin } from "../../queries/queries";
import { useAppState } from "../../src/store/store";

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

const parseOptions = (options) => {
  return options.map((option) => ({
    ...option,
    value: option.coinId,
    label: (
      <span className="flex items-center">
        <span className="text-xs text-gray-300 mr-2">
          #{option.marketCapRank}
        </span>{" "}
        <span className="text-gray-900 ">{option.name}</span>
      </span>
    ),
  }));
};

const promiseOptions = async (inputValue) => {
  const coins = await searchCoin(inputValue);
  return parseOptions(coins);
};

const EmptySpace = () => {
  return (
    <div className="w-full">
      <input
        style={{ colorScheme: "light" }}
        className="text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        type="text"
      />
    </div>
  );
};

const SelectCoin = () => {
  const { theme: projectTheme } = useTheme();
  const state = useAppState();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const currentCoin = state.currentCoin;
  const themeColors = colorsLight;
  const availableTokens = useAppState((state) => state.availableTokens)?.slice(
    0,
    20
  );

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const handleOnChange = async (e) => {
    router.push(`/dca/${e.value}`);
  };

  if (!mounted || !availableTokens) {
    return <EmptySpace />;
  }

  const options = parseOptions(availableTokens);

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
