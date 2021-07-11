export default function HomeWrapper(props) {
  return (
    <div>
      <h1>Test sentry</h1>
      <button
        onClick={() => {
          throw new Error("Trying my best");
        }}
        className="p-2 mt-4 bg-gray-200"
      >
        Throw error
      </button>
    </div>
  );
}
