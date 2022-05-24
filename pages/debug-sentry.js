import { useMutation } from "react-query";
import apiClient from "../server/apiClient";

export default function HomeWrapper() {
  const mutation = useMutation(() => apiClient.post("calculate/test-sentry"));

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <p className="mb-8">{mutation.isLoading ? "loading..." : "Welcome"}</p>
      <div>
        <button
          className="px-2 py-1 text-white hover:bg-red-500 bg-red-400 border border-red-500 rounded transition-all tracking-wide"
          type="button"
          onClick={() => {
            throw new Error("Moooooo!");
          }}
        >
          Throw me!
        </button>
      </div>
      <div>
        <button
          className="px-2 py-1 text-white hover:bg-red-500 bg-red-400 border border-red-500 rounded transition-all tracking-wide"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          Click me
        </button>
      </div>
    </div>
  );
}
