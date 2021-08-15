import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Select from "react-select";
import { getSelectTheme, getThemeColors } from "../SelectCoin/SelectCoin";

const SelectCoinList = (props) => {
  const { theme: projectTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const themeColors = getThemeColors(projectTheme);

  if (!props.availableTokens) {
    return null;
  }

  const options = props.availableTokens.map((coin) => ({
    label: coin.name,
    value: coin.id,
  }));

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

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
        menu: (provided, state) => ({
          ...provided,
          border: "1px solid",
          borderColor: themeColors.primary50,
        }),
      }}
      theme={(theme) => getSelectTheme(theme, projectTheme)}
      className="w-full"
      classNamePrefix="select"
      placeholder="Search token..."
      // defaultValue={}
      isSearchable
      name="coin"
      options={options}
      onChange={(e) => {
        console.log({
          type: "ACTIONS.UPDATE_COIN_ID",
          payload: e.value,
        });
      }}
      maxMenuHeight={200}
    />
  );
};

export default SelectCoinList;
