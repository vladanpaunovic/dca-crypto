import { useMutation } from "react-query";
import apiClient from "../server/apiClient";

export default function HomeWrapper(props) {
  const mutation = useMutation(() => apiClient.post("calculate/test-sentry"));

  return (
    <div>
      hello{" "}
      <button
        className="p-2 bg-gray-300 border"
        onClick={() => mutation.mutate()}
      >
        Click me
      </button>
    </div>
  );
}
