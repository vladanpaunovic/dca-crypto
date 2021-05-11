const InputBox = (props) => {
  return (
    <label className="block mb-3">
      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
        {props.label}
      </span>
      <input
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        type="text"
        value={props.value}
        name={props.identifier}
        onChange={(e) => props.onChange(e)}
        required
        {...props}
      />
    </label>
  );
};

export default InputBox;
